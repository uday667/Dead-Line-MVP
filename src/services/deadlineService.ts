import { supabase } from './supabaseClient';

export interface DeadlineRecord {
  deadline: number;
  start_time: number;
}

export async function saveDeadline(deadline: number, startTime: number): Promise<void> {
  const { data: existing } = await supabase
    .from('deadlines')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('deadlines')
      .update({
        deadline,
        start_time: startTime,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('deadlines')
      .insert([
        {
          deadline,
          start_time: startTime,
        },
      ]);
  }
}

export async function getDeadline(): Promise<DeadlineRecord | null> {
  const { data } = await supabase
    .from('deadlines')
    .select('deadline, start_time')
    .limit(1)
    .maybeSingle();

  return data || null;
}

export async function clearDeadline(): Promise<void> {
  const { data: existing } = await supabase
    .from('deadlines')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('deadlines')
      .delete()
      .eq('id', existing.id);
  }
}
