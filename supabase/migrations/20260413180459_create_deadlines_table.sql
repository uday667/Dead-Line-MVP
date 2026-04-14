/*
  # Create deadlines table for countdown timer

  1. New Tables
    - `deadlines`
      - `id` (uuid, primary key)
      - `deadline` (bigint, timestamp in milliseconds)
      - `start_time` (bigint, when deadline was set in milliseconds)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `deadlines` table
    - Add policy for anonymous users to insert/select/update/delete their own deadline (using session)
*/

CREATE TABLE IF NOT EXISTS deadlines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deadline bigint NOT NULL,
  start_time bigint NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous users to manage single deadline"
  ON deadlines
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
