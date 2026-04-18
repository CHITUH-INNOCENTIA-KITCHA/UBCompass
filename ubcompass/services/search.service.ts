import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function saveSearch(query: string): Promise<void> {
  try {
    await supabase.from('search_history').insert({
      id: uuidv4(),
      query: query.trim(),
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Error saving search:', error);
    // Don't throw - search history is non-critical
  }
}

export async function getRecentSearches(limit: number = 5): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('search_history')
      .select('query')
      .order('created_at', { ascending: false })
      .limit(limit * 3); // Get more to deduplicate

    if (error) throw error;

    // Deduplicate and return unique queries
    const uniqueQueries = Array.from(new Set((data || []).map((item) => item.query)));
    return uniqueQueries.slice(0, limit);
  } catch (error) {
    console.warn('Error fetching recent searches:', error);
    return [];
  }
}
