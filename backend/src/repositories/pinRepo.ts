
import { query } from "../lib/db.js";

export async function findAllPins() {
  const result = await query(
    `SELECT id,creator_id,title,description,latitude,longitude,location_name,starts_at,ends_at,
      is_all_day,recurrence_rule
    FROM public.pins`
  );
  return result.rows;
}
