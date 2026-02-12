import { supabase } from './lib/supabase';

async function testConnection() {
    console.log("Testing Supabase connection...");
    try {
        const { data, error } = await supabase.from('habits').select('count', { count: 'exact', head: true });
        if (error) {
            console.error("Database connection error:", error);
        } else {
            console.log("Database connection successful:", data);
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

testConnection();
