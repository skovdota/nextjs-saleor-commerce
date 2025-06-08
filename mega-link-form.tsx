"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, QrCode } from "lucide-react"

export default function MegaLinkForm() {
  const [formData, setFormData] = useState({
    nome: "",
    idade: "",
    nomeResponsavel: "",
    whatsapp: "",
    cienteEvento: false,
    arquivo: null as File | null,
  })

  const handleInputChange = (field: string, value: string | boolean | File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleInputChange("arquivo", file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Dados do formulário:", formData)
    // Aqui você implementaria o envio dos dados
    alert("Inscrição realizada com sucesso!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mega Link</h1>
          <p className="text-lg text-gray-600">Formulário de Inscrição</p>
        </div>

        {/* Formulário */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Inscreva-se no Evento</CardTitle>
            <CardDescription className="text-center">
              Preencha todos os campos abaixo para confirmar sua participação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  required
                />
              </div>

              {/* Idade */}
              <div className="space-y-2">
                <Label htmlFor="idade">Idade *</Label>
                <Input
                  id="idade"
                  type="number"
                  placeholder="Digite sua idade"
                  value={formData.idade}
                  onChange={(e) => handleInputChange("idade", e.target.value)}
                  min="1"
                  max="120"
                  required
                />
              </div>

              {/* Nome do Responsável */}
              <div className="space-y-2">
                <Label htmlFor="responsavel">Nome do Responsável *</Label>
                <Input
                  id="responsavel"
                  type="text"
                  placeholder="Digite o nome do responsável"
                  value={formData.nomeResponsavel}
                  onChange={(e) => handleInputChange("nomeResponsavel", e.target.value)}
                  required
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  required
                />
              </div>

              {/* Confirmação de Pagamento */}
              <div className="flex items-center space-x-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <Checkbox
                  id="ciente"
                  checked={formData.cienteEvento}
                  onCheckedChange={(checked) => handleInputChange("cienteEvento", checked as boolean)}
                  required
                />
                <Label
                  htmlFor="ciente"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Estou ciente de que este evento é pago e concordo com os termos *
                </Label>
              </div>

              {/* QR Code */}
              <div className="text-center py-6">
                <div className="inline-block p-4 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
                  <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded">
                    <QrCode size={80} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">QR Code para Pagamento</p>
                </div>
              </div>

              {/* Upload de Arquivo */}
              <div className="space-y-2">
                <Label htmlFor="arquivo">Comprovante de Pagamento *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="arquivo"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                    required
                  />
                  <label htmlFor="arquivo" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      {formData.arquivo ? formData.arquivo.name : "Clique para fazer upload do comprovante"}
                    </p>
                    <p className="text-xs text-gray-500">Formatos aceitos: JPG, PNG, PDF (máx. 10MB)</p>
                  </label>
                </div>
              </div>

              {/* Botão de Envio */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                disabled={!formData.cienteEvento}
              >
                Confirmar Inscrição
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Em caso de dúvidas, entre em contato conosco</p>
        </div>
      </div>
    </div>
  )
}
