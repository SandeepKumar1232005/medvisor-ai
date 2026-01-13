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
        relative overflow-hidden
        border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
        transition-all duration-500 ease-out group
        ${isDragActive
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-border/60 hover:border-primary/50 hover:bg-slate-50'
        }
      `}
    >
      <input {...getInputProps()} />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#444cf7_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className={`p-5 rounded-full transition-all duration-500 ${isDragActive ? 'bg-primary/10 ring-4 ring-primary/10' : 'bg-slate-100 group-hover:bg-white group-hover:shadow-lg'}`}>
          {isDragActive ? (
            <ImageIcon className="h-12 w-12 text-primary animate-bounce" />
          ) : (
            <Upload className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {isDragActive ? "Drop to Analyze" : "Upload Medical Scan"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-4">
            Drag & drop or click to browse X-rays, CT scans, or MRIs for instant AI analysis
          </p>
          <div className="inline-flex gap-2 text-xs font-medium text-muted-foreground/80 bg-slate-100 px-3 py-1 rounded-full">
            <span>PNG</span>
            <span>•</span>
            <span>JPG</span>
            <span>•</span>
            <span>DICOM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
