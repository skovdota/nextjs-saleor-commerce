"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import {
  Upload,
  QrCode,
  Phone,
  User,
  Users,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  X,
  MessageCircle,
  FolderIcon,
  Info,
} from "lucide-react"

export default function MegaLinkWordPressForm() {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    nomeResponsavel: "",
    whatsapp: "",
    cienteEvento: false,
    arquivo: null as File | null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showFileInfo, setShowFileInfo] = useState(false)

  // Caminho de armazenamento dos comprovantes
  const storagePath = "/uploads/comprovantes-megalink"

  // Trigger animations on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleInputChange("arquivo", file)

    // Mostrar informação sobre o armazenamento do arquivo
    if (file) {
      setShowFileInfo(true)
      // Esconder a informação após 5 segundos
      setTimeout(() => {
        setShowFileInfo(false)
      }, 5000)
    }
  }

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
    return value
  }

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value)
    handleInputChange("whatsapp", formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envio e armazenamento do arquivo
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Aqui seria o código para enviar o arquivo para o servidor
    // Em um ambiente real, o arquivo seria enviado para a pasta especificada
    console.log(`Arquivo será armazenado em: ${storagePath}/${formData.arquivo?.name}`)
    console.log("Dados do formulário:", formData)

    setIsSubmitting(false)
    setShowSuccess(true)
  }

  const closeSuccessMessage = () => {
    setShowSuccess(false)
    // Reset form
    setFormData({
      nome: "",
      idade: "",
      nomeResponsavel: "",
      whatsapp: "",
      cienteEvento: false,
      arquivo: null,
    })
  }

  // Função para abrir WhatsApp
  const openWhatsApp = () => {
    const phoneNumber = "5511988010688" // Número sem formatação para WhatsApp
    const message = encodeURIComponent("Olá! Tenho dúvidas sobre o evento Mega Link. Podem me ajudar?")
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  // Success Modal Component
  const SuccessModal = () => (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-500 ${showSuccess ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className={`bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 transition-all duration-500 ${showSuccess ? "scale-100 animate-bounce-in" : "scale-75"}`}
        style={{ borderColor: "#fab72b" }}
      >
        <div className="text-center">
          <div className="mb-4">
            <CheckCircle className="w-16 h-16 mx-auto animate-bounce-in" style={{ color: "#fab72b" }} />
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: "#532580" }}>
            🎉 Inscrição Realizada!
          </h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Sua inscrição foi enviada com sucesso! Em breve entraremos em contato pelo WhatsApp para confirmar sua
            participação no <strong style={{ color: "#fab72b" }}>Mega Link</strong>.
          </p>

          {/* Informação sobre o comprovante */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4 text-left">
            <div className="flex items-start gap-3">
              <FolderIcon className="w-5 h-5 mt-0.5 text-blue-500" />
              <div>
                <p className="text-sm font-semibold text-blue-700">Seu comprovante foi armazenado com sucesso!</p>
                <p className="text-xs text-blue-600 mt-1">
                  Arquivo: {formData.arquivo?.name}
                  <br />
                  Local: <span className="font-mono bg-blue-100 px-1 rounded">{storagePath}</span>
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-r from-purple-50 to-yellow-50 p-4 rounded-lg mb-4 border-2"
            style={{ borderColor: "#fab72b" }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: "#532580" }}>
              📱 Fique atento ao seu WhatsApp!
              <br />📧 Verifique também sua caixa de e-mail.
            </p>
            {/* Botão WhatsApp no modal de sucesso */}
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              Falar no WhatsApp
            </button>
          </div>
          <Button
            onClick={closeSuccessMessage}
            className="w-full h-12 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #fab72b, #f59e0b)" }}
          >
            Fechar
          </Button>
        </div>
        <button
          onClick={closeSuccessMessage}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  )

  // Componente de informação sobre o armazenamento do arquivo
  const FileStorageInfo = () => (
    <div
      className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border-2 p-4 max-w-xs transition-all duration-500 z-40 ${
        showFileInfo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
      style={{ borderColor: "#fab72b" }}
    >
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 mt-0.5" style={{ color: "#532580" }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: "#532580" }}>
            Informação sobre o arquivo
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Seu comprovante será armazenado em:
            <br />
            <span className="font-mono bg-gray-100 px-1 rounded text-xs block mt-1 overflow-x-auto whitespace-nowrap">
              {storagePath}/{formData.arquivo?.name}
            </span>
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowFileInfo(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )

  return (
    <div
      className="w-full min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(135deg, #532580 0%, #7c3aed 50%, #532580 100%)" }}
    >
      {/* Success Modal */}
      <SuccessModal />

      {/* File Storage Info */}
      <FileStorageInfo />

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-particles">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Container principal responsivo */}
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header responsivo com animação e logo */}
          <div
            className={`text-center mb-6 sm:mb-8 lg:mb-12 transition-all duration-1000 ${
              isLoaded ? "animate-slide-down opacity-100" : "opacity-0 -translate-y-10"
            }`}
          >
            <div
              className="inline-block p-4 sm:p-6 bg-white rounded-2xl shadow-2xl mb-4 sm:mb-6 border-4 hover:scale-105 transition-transform duration-300"
              style={{ borderColor: "#fab72b" }}
            >
              {/* Logo do Mega Link */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-64 h-32 sm:w-80 sm:h-40 mb-2">
                  <Image
                    src="/images/MegaLogo.png"
                    alt="Mega Link Logo"
                    fill
                    className="object-contain animate-pulse-subtle"
                    priority
                  />
                </div>
                <p
                  className="text-base sm:text-lg lg:text-xl font-semibold animate-bounce-subtle"
                  style={{ color: "#fab72b" }}
                >
                  📢 TÁ CHEGANDO!
                </p>
              </div>
            </div>
          </div>

          {/* Informações do Evento */}
          <div
            className={`mb-6 sm:mb-8 transition-all duration-1000 ${
              isLoaded ? "animate-scale-in opacity-100" : "opacity-0 scale-95"
            }`}
            style={{ animationDelay: "0.2s" }}
          >
            <Card className="shadow-2xl border-4 bg-white" style={{ borderColor: "#fab72b" }}>
              <CardHeader
                className="text-center pb-4"
                style={{ background: "linear-gradient(135deg, #532580, #6b46c1)", color: "white" }}
              >
                <CardTitle className="text-xl sm:text-2xl font-bold">📅 Informações do Evento</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Data */}
                  <div
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-2"
                    style={{ borderColor: "#532580" }}
                  >
                    <Calendar className="w-8 h-8 animate-bounce-icon" style={{ color: "#fab72b" }} />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Data</p>
                      <p className="text-lg font-bold" style={{ color: "#532580" }}>
                        26 de Julho
                      </p>
                    </div>
                  </div>

                  {/* Horário */}
                  <div
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-2"
                    style={{ borderColor: "#fab72b" }}
                  >
                    <Clock className="w-8 h-8 animate-bounce-icon" style={{ color: "#532580" }} />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Horário</p>
                      <p className="text-lg font-bold" style={{ color: "#fab72b" }}>
                        Das 9h às 22h
                      </p>
                    </div>
                  </div>

                  {/* Local */}
                  <div
                    className="md:col-span-2 flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl border-2"
                    style={{ borderColor: "#532580" }}
                  >
                    <MapPin className="w-8 h-8 animate-bounce-icon" style={{ color: "#fab72b" }} />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Local</p>
                      <p className="text-lg font-bold" style={{ color: "#532580" }}>
                        Igreja Lagoinha Jundiaí
                      </p>
                    </div>
                  </div>

                  {/* Faixa Etária */}
                  <div
                    className="md:col-span-2 flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl border-2"
                    style={{ borderColor: "#fab72b" }}
                  >
                    <Users className="w-8 h-8 animate-bounce-icon" style={{ color: "#532580" }} />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Faixa Etária</p>
                      <p className="text-lg font-bold" style={{ color: "#fab72b" }}>
                        11 a 14 anos
                      </p>
                    </div>
                  </div>

                  {/* Preços */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <DollarSign className="w-8 h-8 animate-bounce-icon" style={{ color: "#fab72b" }} />
                      <h3 className="text-lg font-bold" style={{ color: "#532580" }}>
                        Valores dos Lotes
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-300 text-center">
                        <p className="text-sm font-medium text-green-700">1º Lote</p>
                        <p className="text-xl font-bold text-green-800">R$ 60,00</p>
                        <p className="text-xs text-green-600">✅ Disponível</p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300 text-center">
                        <p className="text-sm font-medium text-yellow-700">2º Lote</p>
                        <p className="text-xl font-bold text-yellow-800">Em breve</p>
                        <p className="text-xs text-yellow-600">⏳ Aguarde</p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-300 text-center">
                        <p className="text-sm font-medium text-orange-700">3º Lote</p>
                        <p className="text-xl font-bold text-orange-800">Em breve</p>
                        <p className="text-xs text-orange-600">⏳ Aguarde</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card do formulário com animação */}
          <Card
            className={`shadow-2xl border-4 bg-white transition-all duration-1000 ${
              isLoaded ? "animate-scale-in opacity-100" : "opacity-0 scale-95"
            }`}
            style={{ borderColor: "#fab72b", animationDelay: "0.4s" }}
          >
            <CardHeader
              className="text-center pb-4 sm:pb-6 animate-slide-in-left"
              style={{
                background: "linear-gradient(135deg, #532580, #6b46c1)",
                color: "white",
                animationDelay: "0.6s",
              }}
            >
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold animate-pulse-glow">
                🎯 Garante Sua Vaga!
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-white/90 px-2">
                Todos os campos marcados com <span style={{ color: "#fab72b" }}>*</span> são obrigatórios
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Grid responsivo para campos com animações escalonadas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Nome */}
                  <div
                    className={`lg:col-span-2 space-y-2 transition-all duration-700 ${
                      isLoaded ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                    }`}
                    style={{ animationDelay: "0.7s" }}
                  >
                    <Label
                      htmlFor="nome"
                      className="flex items-center gap-2 text-sm sm:text-base font-semibold animate-fade-in"
                      style={{ color: "#532580" }}
                    >
                      <User className="w-4 h-4 animate-bounce-icon" style={{ color: "#fab72b" }} />
                      Nome Completo <span style={{ color: "#fab72b" }}>*</span>
                    </Label>
                    <Input
                      id="nome"
                      type="text"
                      placeholder="Digite seu nome completo"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      className="h-12 sm:h-14 text-base border-2 transition-all duration-300 focus:ring-2 hover:scale-[1.02] focus:scale-[1.02]"
                      style={
                        {
                          borderColor: formData.nome ? "#fab72b" : "#532580",
                          "--tw-ring-color": "#fab72b",
                        } as React.CSSProperties
                      }
                      required
                    />
                  </div>

                  {/* Idade */}
                  <div
                    className={`space-y-2 transition-all duration-700 ${
                      isLoaded ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                    }`}
                    style={{ animationDelay: "0.8s" }}
                  >
                    <Label
                      htmlFor="idade"
                      className="flex items-center gap-2 text-sm sm:text-base font-semibold"
                      style={{ color: "#532580" }}
                    >
                      <Calendar className="w-4 h-4 animate-bounce-icon" style={{ color: "#fab72b" }} />
                      Idade <span style={{ color: "#fab72b" }}>*</span>
                    </Label>
                    <Input
                      id="idade"
                      type="number"
                      placeholder="Sua idade"
                      value={formData.idade}
                      onChange={(e) => handleInputChange("idade", e.target.value)}
                      className="h-12 sm:h-14 text-base border-2 transition-all duration-300 focus:ring-2 hover:scale-[1.02] focus:scale-[1.02]"
                      style={
                        {
                          borderColor: formData.idade ? "#fab72b" : "#532580",
                          "--tw-ring-color": "#fab72b",
                        } as React.CSSProperties
                      }
                      min="1"
                      max="120"
                      required
                    />
                  </div>

                  {/* WhatsApp */}
                  <div
                    className={`space-y-2 transition-all duration-700 ${
                      isLoaded ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                    }`}
                    style={{ animationDelay: "0.9s" }}
                  >
                    <Label
                      htmlFor="whatsapp"
                      className="flex items-center gap-2 text-sm sm:text-base font-semibold"
                      style={{ color: "#532580" }}
                    >
                      <Phone className="w-4 h-4 animate-bounce-icon" style={{ color: "#fab72b" }} />
                      WhatsApp <span style={{ color: "#fab72b" }}>*</span>
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.whatsapp}
                      onChange={handleWhatsAppChange}
                      className="h-12 sm:h-14 text-base border-2 transition-all duration-300 focus:ring-2 hover:scale-[1.02] focus:scale-[1.02]"
                      style={
                        {
                          borderColor: formData.whatsapp ? "#fab72b" : "#532580",
                          "--tw-ring-color": "#fab72b",
                        } as React.CSSProperties
                      }
                      required
                    />
                  </div>

                  {/* Nome do Responsável */}
                  <div
                    className={`lg:col-span-2 space-y-2 transition-all duration-700 ${
                      isLoaded ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                    }`}
                    style={{ animationDelay: "1s" }}
                  >
                    <Label
                      htmlFor="responsavel"
                      className="flex items-center gap-2 text-sm sm:text-base font-semibold"
                      style={{ color: "#532580" }}
                    >
                      <Users className="w-4 h-4 animate-bounce-icon" style={{ color: "#fab72b" }} />
                      Nome do Responsável <span style={{ color: "#fab72b" }}>*</span>
                    </Label>
                    <Input
                      id="responsavel"
                      type="text"
                      placeholder="Digite o nome do responsável"
                      value={formData.nomeResponsavel}
                      onChange={(e) => handleInputChange("nomeResponsavel", e.target.value)}
                      className="h-12 sm:h-14 text-base border-2 transition-all duration-300 focus:ring-2 hover:scale-[1.02] focus:scale-[1.02]"
                      style={
                        {
                          borderColor: formData.nomeResponsavel ? "#fab72b" : "#532580",
                          "--tw-ring-color": "#fab72b",
                        } as React.CSSProperties
                      }
                      required
                    />
                  </div>
                </div>

                {/* Confirmação de Pagamento com animação */}
                <div
                  className={`p-4 sm:p-6 rounded-xl border-3 shadow-lg transition-all duration-700 hover:scale-[1.02] ${
                    isLoaded ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    background: "linear-gradient(135deg, #fab72b10, #fab72b20)",
                    borderColor: formData.cienteEvento ? "#fab72b" : "#532580",
                    animationDelay: "1.1s",
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="ciente"
                      checked={formData.cienteEvento}
                      onCheckedChange={(checked) => handleInputChange("cienteEvento", checked as boolean)}
                      className="mt-1 border-2 data-[state=checked]:border-white transition-all duration-300 hover:scale-110"
                      style={{
                        borderColor: "#532580",
                        backgroundColor: formData.cienteEvento ? "#fab72b" : "transparent",
                      }}
                      required
                    />
                    <Label
                      htmlFor="ciente"
                      className="text-sm sm:text-base font-semibold leading-relaxed cursor-pointer transition-colors duration-300 hover:opacity-80"
                      style={{ color: "#532580" }}
                    >
                      Estou ciente de que este evento é{" "}
                      <span style={{ color: "#fab72b" }} className="animate-pulse-text">
                        PAGO (R$ 60,00 - 1º Lote)
                      </span>{" "}
                      e concordo com os termos e condições <span style={{ color: "#fab72b" }}>*</span>
                    </Label>
                  </div>
                </div>

                {/* Seção de Pagamento com animação */}
                <div
                  className={`rounded-xl p-4 sm:p-6 border-3 shadow-lg transition-all duration-700 ${
                    isLoaded ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    background: "linear-gradient(135deg, #532580, #6b46c1)",
                    borderColor: "#fab72b",
                    animationDelay: "1.2s",
                  }}
                >
                  <h3 className="text-lg sm:text-xl font-bold text-center mb-4 text-white animate-pulse-glow">
                    💳 Pagamento via PIX - R$ 60,00
                  </h3>

                  {/* QR Code responsivo com animação especial */}
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div
                      className={`bg-white p-4 sm:p-6 rounded-xl shadow-xl border-4 transition-all duration-1000 hover:scale-105 ${
                        isLoaded ? "animate-bounce-in opacity-100" : "opacity-0 scale-50"
                      }`}
                      style={{
                        borderColor: "#fab72b",
                        animationDelay: "1.3s",
                      }}
                    >
                      <div
                        className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gray-100 flex items-center justify-center rounded-lg border-2 animate-pulse-border"
                        style={{ borderColor: "#532580" }}
                      >
                        <QrCode
                          size={80}
                          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 animate-spin-slow"
                          style={{ color: "#532580" }}
                        />
                      </div>
                      <p
                        className="text-xs sm:text-sm text-center mt-2 font-bold animate-bounce-subtle"
                        style={{ color: "#fab72b" }}
                      >
                        Escaneie para Pagar
                      </p>
                    </div>
                  </div>

                  {/* Instruções de pagamento */}
                  <div className="text-center text-sm sm:text-base text-white mb-4 space-y-2">
                    <p className="font-medium animate-fade-in-delayed" style={{ animationDelay: "1.4s" }}>
                      1. Escaneie o QR Code acima
                    </p>
                    <p className="font-medium animate-fade-in-delayed" style={{ animationDelay: "1.5s" }}>
                      2. Realize o pagamento de <strong style={{ color: "#fab72b" }}>R$ 60,00</strong> via PIX
                    </p>
                    <p
                      className="font-bold text-lg animate-bounce-text"
                      style={{ color: "#fab72b", animationDelay: "1.6s" }}
                    >
                      3. Faça upload do comprovante abaixo ⬇️
                    </p>
                  </div>
                </div>

                {/* Upload de Arquivo com animação */}
                <div
                  className={`space-y-3 transition-all duration-700 ${
                    isLoaded ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                  }`}
                  style={{ animationDelay: "1.4s" }}
                >
                  <Label
                    htmlFor="arquivo"
                    className="text-sm sm:text-base font-bold animate-fade-in flex items-center gap-2"
                    style={{ color: "#532580" }}
                  >
                    📄 Comprovante de Pagamento <span style={{ color: "#fab72b" }}>*</span>
                  </Label>
                  <div
                    className="border-3 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-300 hover:shadow-lg cursor-pointer hover:scale-[1.02] animate-pulse-border-dashed"
                    style={{
                      borderColor: formData.arquivo ? "#fab72b" : "#532580",
                      backgroundColor: formData.arquivo ? "#fab72b10" : "transparent",
                    }}
                  >
                    <input
                      id="arquivo"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      className="hidden"
                      required
                    />
                    <label htmlFor="arquivo" className="cursor-pointer block">
                      <Upload
                        className={`mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 transition-all duration-300 ${
                          formData.arquivo ? "animate-bounce" : "animate-float"
                        }`}
                        style={{ color: formData.arquivo ? "#fab72b" : "#532580" }}
                      />
                      <p
                        className="text-sm sm:text-base mb-2 font-semibold transition-colors duration-300"
                        style={{ color: "#532580" }}
                      >
                        {formData.arquivo ? (
                          <span style={{ color: "#fab72b" }} className="animate-pulse-text">
                            ✅ {formData.arquivo.name}
                          </span>
                        ) : (
                          "📱 Toque aqui para enviar o comprovante"
                        )}
                      </p>
                      <p className="text-xs sm:text-sm font-medium" style={{ color: "#532580" }}>
                        Formatos: JPG, PNG, PDF • Máx: 10MB
                      </p>
                    </label>
                  </div>

                  {/* Informação sobre o armazenamento */}
                  {formData.arquivo && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2 text-sm">
                      <div className="flex items-start gap-2">
                        <FolderIcon className="w-4 h-4 mt-0.5 text-blue-500" />
                        <div>
                          <p className="font-medium text-blue-700">Informação sobre o arquivo</p>
                          <p className="text-xs text-blue-600 mt-1">
                            Seu comprovante será armazenado em:
                            <br />
                            <span className="font-mono bg-blue-100 px-1 rounded text-xs block mt-1 overflow-x-auto whitespace-nowrap">
                              {storagePath}/{formData.arquivo.name}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botão de Envio com animação */}
                <div
                  className={`pt-4 sm:pt-6 transition-all duration-700 ${
                    isLoaded ? "animate-slide-up opacity-100" : "opacity-0 translate-y-8"
                  }`}
                  style={{ animationDelay: "1.5s" }}
                >
                  <Button
                    type="submit"
                    className={`w-full h-12 sm:h-16 text-white text-base sm:text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 hover:scale-[1.02] ${
                      formData.cienteEvento && !isSubmitting ? "animate-pulse-glow" : ""
                    }`}
                    style={{
                      background:
                        formData.cienteEvento && !isSubmitting
                          ? "linear-gradient(135deg, #fab72b, #f59e0b)"
                          : "#532580",
                      borderColor: "#fab72b",
                    }}
                    disabled={!formData.cienteEvento || isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processando Inscrição...
                      </div>
                    ) : (
                      <span className="animate-bounce-subtle">🚀 Confirmar Inscrição</span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Footer com animação e WhatsApp clicável */}
          <div
            className={`text-center mt-6 sm:mt-8 text-white/90 text-xs sm:text-sm transition-all duration-1000 ${
              isLoaded ? "animate-fade-in-up opacity-100" : "opacity-0 translate-y-4"
            }`}
            style={{ animationDelay: "1.6s" }}
          >
            <div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 hover:bg-white/20 transition-all duration-300"
              style={{ borderColor: "#fab72b" }}
            >
              <p className="mb-3 font-semibold animate-pulse-subtle">🔒 Seus dados estão seguros conosco</p>

              {/* Seção de contato com WhatsApp clicável */}
              <div className="mb-3">
                <p className="font-medium mb-2">Em caso de dúvidas, entre em contato pelo WhatsApp:</p>
                <button
                  onClick={openWhatsApp}
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 animate-pulse-glow"
                >
                  <MessageCircle className="w-4 h-4" />
                  (11) 98801-0688
                </button>
              </div>

              <p className="text-xs mt-2 opacity-75">Link - Lagoinha Jundiai - LJDI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
