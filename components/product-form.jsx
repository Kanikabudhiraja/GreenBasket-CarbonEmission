"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Trash2, Plus } from "lucide-react"

export default function ProductForm({ onSubmit, initialData }) {
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState(initialData?.images || [''])
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: initialData || {
      name: "",
      price: "",
      description: "",
      category: "",
      carbonFootprint: "",
      stock: "",
      status: "active",
      eco: true,
    }
  });

  const status = watch('status');

  const handleAddImageField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveImageField = (index) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
    setValue('images', newImageUrls.filter(url => url));
  };

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      // Parse numeric values
      const parsedData = {
        ...data,
        price: parseFloat(data.price),
        carbonFootprint: parseFloat(data.carbonFootprint),
        stock: parseInt(data.stock),
        images: imageUrls.filter(url => url),
        eco: data.eco === 'true' || data.eco === true,
      };
      
      await onSubmit(parsedData);
      toast.success("Product saved successfully!");
      if (!initialData) reset();
    } catch (error) {
      toast.error("Failed to save product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: "clothing", label: "Clothing" },
    { value: "furniture", label: "Furniture" },
    { value: "accessories", label: "Accessories" },
    { value: "personal-care", label: "Personal Care" },
    { value: "home", label: "Home Goods" },
    { value: "stationery", label: "Stationery" },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name*</Label>
        <Input
          id="name"
          {...register("name", { 
            required: "Product name is required",
            maxLength: { 
              value: 100, 
              message: "Name cannot exceed 100 characters" 
            }
          })}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)*</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price", { 
              required: "Price is required",
              min: { 
                value: 0, 
                message: "Price must be positive" 
              }
            })}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity*</Label>
          <Input
            id="stock"
            type="number"
            {...register("stock", { 
              required: "Stock quantity is required",
              min: { 
                value: 0, 
                message: "Stock must be positive" 
              }
            })}
          />
          {errors.stock && (
            <p className="text-sm text-red-500">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description*</Label>
        <Textarea
          id="description"
          {...register("description", { 
            required: "Description is required",
            maxLength: { 
              value: 500, 
              message: "Description cannot exceed 500 characters" 
            }
          })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category*</Label>
          <Select 
            onValueChange={(value) => setValue('category', value)}
            defaultValue={initialData?.category}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register("category", { 
              required: "Category is required" 
            })}
          />
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="carbonFootprint">Carbon Footprint (kg CO₂)*</Label>
          <Input
            id="carbonFootprint"
            type="number"
            step="0.1"
            {...register("carbonFootprint", { 
              required: "Carbon footprint is required",
              min: { 
                value: 0, 
                message: "Carbon footprint must be positive" 
              }
            })}
          />
          {errors.carbonFootprint && (
            <p className="text-sm text-red-500">{errors.carbonFootprint.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <RadioGroup 
          defaultValue={initialData?.status || "active"}
          onValueChange={(value) => setValue('status', value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="active" id="active" />
            <Label htmlFor="active" className="cursor-pointer">Active</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="inactive" id="inactive" />
            <Label htmlFor="inactive" className="cursor-pointer">Inactive</Label>
          </div>
        </RadioGroup>
        <input 
          type="hidden" 
          {...register("status")} 
        />
      </div>

      <div className="space-y-2">
        <Label>Eco-Friendly Product</Label>
        <RadioGroup 
          defaultValue={initialData?.eco === false ? "false" : "true"}
          onValueChange={(value) => setValue('eco', value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="eco-true" />
            <Label htmlFor="eco-true" className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="eco-false" />
            <Label htmlFor="eco-false" className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
        <input 
          type="hidden" 
          {...register("eco")} 
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Product Images</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddImageField}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" /> Add Image
          </Button>
        </div>
        <div className="space-y-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                placeholder="Enter image URL"
              />
              {index > 0 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleRemoveImageField(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
          {loading ? "Saving..." : (initialData ? "Update Product" : "Create Product")}
        </Button>
      </div>
    </form>
  );
} 