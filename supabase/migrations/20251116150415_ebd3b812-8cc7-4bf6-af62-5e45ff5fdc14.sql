-- Create patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  medical_record_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create analysis_history table
CREATE TABLE public.analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  confidence_score DECIMAL(5,2) NOT NULL,
  scan_type TEXT NOT NULL,
  differential_diagnoses JSONB,
  gradcam_heatmap_url TEXT,
  analyzed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create diagnostic_reports table
CREATE TABLE public.diagnostic_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES public.analysis_history(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  report_title TEXT NOT NULL,
  clinical_findings TEXT NOT NULL,
  impression TEXT NOT NULL,
  recommendations TEXT,
  radiologist_name TEXT,
  radiologist_signature TEXT,
  report_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients (authenticated medical staff can view/manage)
CREATE POLICY "Authenticated users can view patients"
ON public.patients FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert patients"
ON public.patients FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update patients"
ON public.patients FOR UPDATE
TO authenticated
USING (true);

-- RLS Policies for analysis_history
CREATE POLICY "Authenticated users can view analysis history"
ON public.analysis_history FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert analysis"
ON public.analysis_history FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update analysis"
ON public.analysis_history FOR UPDATE
TO authenticated
USING (true);

-- RLS Policies for diagnostic_reports
CREATE POLICY "Authenticated users can view reports"
ON public.diagnostic_reports FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert reports"
ON public.diagnostic_reports FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update reports"
ON public.diagnostic_reports FOR UPDATE
TO authenticated
USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_patients_patient_id ON public.patients(patient_id);
CREATE INDEX idx_analysis_patient_id ON public.analysis_history(patient_id);
CREATE INDEX idx_reports_patient_id ON public.diagnostic_reports(patient_id);
CREATE INDEX idx_analysis_created_at ON public.analysis_history(created_at DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates on patients
CREATE TRIGGER update_patients_updated_at
BEFORE UPDATE ON public.patients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();