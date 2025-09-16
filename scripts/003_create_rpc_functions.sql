-- RPC Function: Try to start a hunt session
CREATE OR REPLACE FUNCTION try_start_session(
  p_hunt_id UUID,
  p_duration_hours INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_session_id UUID;
  v_end_time TIMESTAMP WITH TIME ZONE;
  v_existing_session_count INTEGER;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Check if hunt already has an active session
  SELECT COUNT(*) INTO v_existing_session_count
  FROM public.sessions 
  WHERE hunt_id = p_hunt_id 
    AND is_active = true 
    AND end_time > NOW();

  IF v_existing_session_count > 0 THEN
    RETURN json_build_object('success', false, 'error', 'Hunt already occupied');
  END IF;

  -- Calculate end time
  v_end_time := NOW() + (p_duration_hours || ' hours')::INTERVAL;
  
  -- Create new session
  INSERT INTO public.sessions (hunt_id, user_id, end_time, duration_hours)
  VALUES (p_hunt_id, v_user_id, v_end_time, p_duration_hours)
  RETURNING id INTO v_session_id;

  -- Remove user from queue if they were waiting
  DELETE FROM public.queue 
  WHERE hunt_id = p_hunt_id AND user_id = v_user_id;

  -- Reorder queue positions
  UPDATE public.queue 
  SET position = position - 1 
  WHERE hunt_id = p_hunt_id AND position > (
    SELECT COALESCE(MIN(position), 0) 
    FROM public.queue 
    WHERE hunt_id = p_hunt_id AND user_id = v_user_id
  );

  RETURN json_build_object(
    'success', true, 
    'session_id', v_session_id,
    'end_time', v_end_time
  );
END;
$$;

-- RPC Function: End current user's session
CREATE OR REPLACE FUNCTION end_my_session(p_hunt_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_session_count INTEGER;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- End the session
  UPDATE public.sessions 
  SET is_active = false, end_time = NOW()
  WHERE hunt_id = p_hunt_id 
    AND user_id = v_user_id 
    AND is_active = true;

  GET DIAGNOSTICS v_session_count = ROW_COUNT;

  IF v_session_count = 0 THEN
    RETURN json_build_object('success', false, 'error', 'No active session found');
  END IF;

  RETURN json_build_object('success', true);
END;
$$;

-- RPC Function: Join hunt queue
CREATE OR REPLACE FUNCTION join_hunt_queue(p_hunt_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_next_position INTEGER;
  v_existing_count INTEGER;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Check if user is already in queue
  SELECT COUNT(*) INTO v_existing_count
  FROM public.queue 
  WHERE hunt_id = p_hunt_id AND user_id = v_user_id;

  IF v_existing_count > 0 THEN
    RETURN json_build_object('success', false, 'error', 'Already in queue');
  END IF;

  -- Get next position
  SELECT COALESCE(MAX(position), 0) + 1 INTO v_next_position
  FROM public.queue 
  WHERE hunt_id = p_hunt_id;

  -- Insert into queue
  INSERT INTO public.queue (hunt_id, user_id, position)
  VALUES (p_hunt_id, v_user_id, v_next_position);

  RETURN json_build_object('success', true, 'position', v_next_position);
END;
$$;

-- RPC Function: Leave hunt queue
CREATE OR REPLACE FUNCTION leave_hunt_queue(p_hunt_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_user_position INTEGER;
  v_deleted_count INTEGER;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Get user's position before deleting
  SELECT position INTO v_user_position
  FROM public.queue 
  WHERE hunt_id = p_hunt_id AND user_id = v_user_id;

  -- Delete from queue
  DELETE FROM public.queue 
  WHERE hunt_id = p_hunt_id AND user_id = v_user_id;

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  IF v_deleted_count = 0 THEN
    RETURN json_build_object('success', false, 'error', 'Not in queue');
  END IF;

  -- Reorder remaining queue positions
  UPDATE public.queue 
  SET position = position - 1 
  WHERE hunt_id = p_hunt_id AND position > v_user_position;

  RETURN json_build_object('success', true);
END;
$$;

-- RPC Function: Promote first in queue if hunt is free
CREATE OR REPLACE FUNCTION promote_queue_if_free(p_hunt_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_active_session_count INTEGER;
  v_first_in_queue UUID;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Check if hunt has active session
  SELECT COUNT(*) INTO v_active_session_count
  FROM public.sessions 
  WHERE hunt_id = p_hunt_id 
    AND is_active = true 
    AND end_time > NOW();

  IF v_active_session_count > 0 THEN
    RETURN json_build_object('success', false, 'error', 'Hunt is occupied');
  END IF;

  -- Get first user in queue
  SELECT user_id INTO v_first_in_queue
  FROM public.queue 
  WHERE hunt_id = p_hunt_id 
  ORDER BY position ASC 
  LIMIT 1;

  IF v_first_in_queue IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Queue is empty');
  END IF;

  -- Only the first person in queue can promote themselves
  IF v_first_in_queue != v_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Not first in queue');
  END IF;

  RETURN json_build_object('success', true, 'can_promote', true);
END;
$$;
