-- Create user_plans table
CREATE TABLE IF NOT EXISTS public.user_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add plan_id to habits table to link habits to specific plans
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='habits' AND column_name='plan_id') THEN
        ALTER TABLE public.habits ADD COLUMN plan_id UUID REFERENCES public.user_plans(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS for user_plans
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for user_plans
CREATE POLICY "Users can manage their own plans" 
ON public.user_plans 
FOR ALL 
USING (auth.uid() = user_id);
