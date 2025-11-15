import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void;
}

export const ImageUploader = ({ onImageUpload }: ImageUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        onImageUpload(imageData);
        toast.success("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.dicom', '.dcm']
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
        transition-all duration-300
        ${isDragActive 
          ? 'border-primary bg-medical-blue-light' 
          : 'border-border hover:border-primary hover:bg-clinical-gray-light'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-medical-blue-light rounded-full">
          {isDragActive ? (
            <ImageIcon className="h-12 w-12 text-primary" />
          ) : (
            <Upload className="h-12 w-12 text-primary" />
          )}
        </div>
        
        <div>
          <p className="text-lg font-medium text-foreground mb-1">
            {isDragActive ? "Drop your medical image here" : "Upload Medical Image"}
          </p>
          <p className="text-sm text-muted-foreground">
            Drag and drop or click to browse
          </p>
          <p className="text-xs text-clinical-gray mt-2">
            Supports X-rays, CT scans, MRI (PNG, JPEG, DICOM)
          </p>
        </div>
      </div>
    </div>
  );
};
