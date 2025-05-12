"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ProductForm from "@/components/product-form"

export default function ProductModal({ isOpen, onClose, initialData, onSubmit }) {
  const [open, setOpen] = useState(isOpen || false)
  
  const handleClose = () => {
    setOpen(false)
    if (onClose) onClose()
  }
  
  const handleSubmit = async (data) => {
    await onSubmit(data)
    handleClose()
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <ProductForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
        />
      </DialogContent>
    </Dialog>
  )
} 