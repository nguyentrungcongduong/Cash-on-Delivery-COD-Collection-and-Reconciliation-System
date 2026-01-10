package com.example.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseFixerConfig {

    @Bean
    public CommandLineRunner fixDatabase(JdbcTemplate jdbcTemplate) {
        return args -> {
            System.out.println("Checking and fixing database schema...");

            try {
                // Drop the old status check constraint created by Hibernate
                // This is necessary because we changed enum values (DELIVERED ->
                // DELIVERED_SUCCESS)
                // We try a robust way for PostgreSQL
                jdbcTemplate.execute("DO $$ \n" +
                        "DECLARE \n" +
                        "    r RECORD; \n" +
                        "BEGIN \n" +
                        "    FOR r IN ( \n" +
                        "        SELECT conname \n" +
                        "        FROM pg_constraint \n" +
                        "        WHERE conrelid = 'orders'::regclass AND contype = 'c' \n" +
                        "    ) LOOP \n" +
                        "        EXECUTE 'ALTER TABLE orders DROP CONSTRAINT ' || quote_ident(r.conname); \n" +
                        "    END LOOP; \n" +
                        "END $$;");

                // Fallback for simple name
                try {
                    jdbcTemplate.execute("ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check");
                } catch (Exception ignore) {
                }

                // Thêm cột pickup_address vào bảng orders nếu chưa có
                jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_address VARCHAR(255)");
                jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS dimensions VARCHAR(255)");
                jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS weight DOUBLE PRECISION");
                jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP");
                jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS failed_at TIMESTAMP");
                jdbcTemplate.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS fail_reason VARCHAR(255)");

                // Ensure order_code is unique (optional but good)
                try {
                    jdbcTemplate.execute("ALTER TABLE orders ADD CONSTRAINT uk_order_code UNIQUE (order_code)");
                } catch (Exception ignore) {
                }

                // Migrating old status names to new ones if they exist
                jdbcTemplate.execute("UPDATE orders SET status = 'DELIVERED_SUCCESS' WHERE status = 'DELIVERED'");
                jdbcTemplate.execute("UPDATE orders SET status = 'DELIVERY_FAILED' WHERE status = 'FAILED'");

                System.out.println("Successfully fixed pickup_address, dimensions, weight and migrated status names.");
            } catch (Exception e) {
                System.err.println("Error fixing database schema: " + e.getMessage());
            }

            try {
                // Ensure settlements table and columns
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS settlements (id BIGSERIAL PRIMARY KEY)");
                jdbcTemplate.execute("ALTER TABLE settlements ADD COLUMN IF NOT EXISTS shop_id BIGINT");
                jdbcTemplate.execute("ALTER TABLE settlements ADD COLUMN IF NOT EXISTS shipper_id BIGINT");
                jdbcTemplate.execute("ALTER TABLE settlements ADD COLUMN IF NOT EXISTS total_amount DOUBLE PRECISION");
                jdbcTemplate.execute("ALTER TABLE settlements ADD COLUMN IF NOT EXISTS status VARCHAR(255)");
                jdbcTemplate.execute("ALTER TABLE settlements ADD COLUMN IF NOT EXISTS created_at TIMESTAMP");
                jdbcTemplate.execute("ALTER TABLE settlements ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP");

                // Ensure ledgers table and columns
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS ledgers (id BIGSERIAL PRIMARY KEY)");
                jdbcTemplate.execute("ALTER TABLE ledgers ADD COLUMN IF NOT EXISTS order_id BIGINT");
                jdbcTemplate.execute("ALTER TABLE ledgers ADD COLUMN IF NOT EXISTS shop_id BIGINT");
                jdbcTemplate.execute("ALTER TABLE ledgers ADD COLUMN IF NOT EXISTS shipper_id BIGINT");
                jdbcTemplate.execute("ALTER TABLE ledgers ADD COLUMN IF NOT EXISTS amount DOUBLE PRECISION");
                jdbcTemplate.execute("ALTER TABLE ledgers ADD COLUMN IF NOT EXISTS type VARCHAR(255)");
                jdbcTemplate.execute("ALTER TABLE ledgers ADD COLUMN IF NOT EXISTS settlement_id BIGINT");
                jdbcTemplate.execute("ALTER TABLE ledgers ADD COLUMN IF NOT EXISTS created_at TIMESTAMP");

                // Thêm cột status vào bảng users nếu chưa có
                jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(255) DEFAULT 'ACTIVE'");

                // Ensure notifications table exists
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS notifications (" +
                        "id BIGSERIAL PRIMARY KEY, " +
                        "user_id UUID NOT NULL, " +
                        "title VARCHAR(255) NOT NULL, " +
                        "content TEXT, " +
                        "is_read BOOLEAN DEFAULT FALSE, " +
                        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                        "CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE" +
                        ")");

                System.out.println("✅ Notifications table checked/created.");
                System.out.println("Database tables and columns checked/created.");
            } catch (Exception e) {
                System.err.println("Error during SQL schema check: " + e.getMessage());
            }
        };
    }
}
