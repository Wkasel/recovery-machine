/**
 * Script to generate availability timeslots for the next 60 days
 * Run with: npx ts-node scripts/generate-timeslots.ts
 * Or: npx tsx scripts/generate-timeslots.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateTimeslots() {
  const slots: Array<{
    date: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
    max_bookings: number;
  }> = [];

  // Generate slots for the next 60 days
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 60);

  console.log(`Generating slots from ${today.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}`);

  for (let date = new Date(today); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split("T")[0];

    // Generate 2-hour slots from 8 AM to 8 PM
    for (let hour = 8; hour < 20; hour += 2) {
      slots.push({
        date: dateStr,
        start_time: `${hour.toString().padStart(2, "0")}:00:00`,
        end_time: `${(hour + 2).toString().padStart(2, "0")}:00:00`,
        is_available: true,
        max_bookings: 1,
      });
    }
  }

  console.log(`Generated ${slots.length} timeslots`);

  // Check for existing slots to avoid duplicates
  const { data: existingSlots, error: fetchError } = await supabase
    .from("availability_slots")
    .select("date, start_time")
    .gte("date", today.toISOString().split("T")[0]);

  if (fetchError) {
    console.error("Error fetching existing slots:", fetchError);
    process.exit(1);
  }

  // Create a set of existing slot keys for fast lookup
  const existingKeys = new Set(
    (existingSlots || []).map((s) => `${s.date}-${s.start_time}`)
  );

  // Filter out slots that already exist
  const newSlots = slots.filter(
    (slot) => !existingKeys.has(`${slot.date}-${slot.start_time}`)
  );

  if (newSlots.length === 0) {
    console.log("All slots already exist. No new slots to insert.");
    return;
  }

  console.log(`Inserting ${newSlots.length} new slots (${slots.length - newSlots.length} already exist)`);

  // Insert in batches of 100 to avoid payload limits
  const batchSize = 100;
  let insertedCount = 0;

  for (let i = 0; i < newSlots.length; i += batchSize) {
    const batch = newSlots.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from("availability_slots")
      .insert(batch)
      .select();

    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      continue;
    }

    insertedCount += data?.length || 0;
    console.log(`Batch ${Math.floor(i / batchSize) + 1}: Inserted ${data?.length || 0} slots`);
  }

  console.log(`\nSuccessfully inserted ${insertedCount} timeslots`);
}

generateTimeslots()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
