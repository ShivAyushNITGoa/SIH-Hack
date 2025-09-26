-- Create a lightweight votes table for report upvotes if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'report_votes'
    ) THEN
        CREATE TABLE public.report_votes (
            report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
            user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
            created_at timestamptz DEFAULT now(),
            PRIMARY KEY (report_id, user_id)
        );

        CREATE INDEX idx_report_votes_report_id ON public.report_votes(report_id);
        CREATE INDEX idx_report_votes_user_id ON public.report_votes(user_id);
    END IF;
END $$;

-- Enable RLS and add policies
ALTER TABLE public.report_votes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- Drop old policies if exist
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='report_votes' AND policyname='Anyone can read report votes') THEN
        DROP POLICY "Anyone can read report votes" ON public.report_votes;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='report_votes' AND policyname='Authenticated users can vote') THEN
        DROP POLICY "Authenticated users can vote" ON public.report_votes;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='report_votes' AND policyname='Users can remove their vote') THEN
        DROP POLICY "Users can remove their vote" ON public.report_votes;
    END IF;

    CREATE POLICY "Anyone can read report votes" ON public.report_votes
      FOR SELECT USING (true);

    CREATE POLICY "Authenticated users can vote" ON public.report_votes
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');

    CREATE POLICY "Users can remove their vote" ON public.report_votes
      FOR DELETE USING (auth.uid() = user_id);
END $$;


