-- Add order_type column to orders table for efficient querying
-- This allows us to easily distinguish between subscriptions and one-time payments

-- Add the order_type column
ALTER TABLE orders
ADD COLUMN order_type TEXT NOT NULL DEFAULT 'one_time'
CHECK (order_type IN ('subscription', 'one_time', 'setup_fee'));

-- Migrate existing data from metadata to the new column
UPDATE orders
SET order_type = COALESCE(metadata->>'order_type', 'one_time')
WHERE order_type = 'one_time';

-- Create index for efficient queries
CREATE INDEX idx_orders_order_type ON orders(order_type);

-- Add comment for documentation
COMMENT ON COLUMN orders.order_type IS 'Type of order: subscription (recurring), one_time (single payment), or setup_fee (initial setup)';

-- Example queries this enables:
-- Get all active subscribers: SELECT * FROM orders WHERE order_type = 'subscription' AND status = 'paid';
-- Get all one-time customers: SELECT * FROM orders WHERE order_type = 'one_time' AND status = 'paid';
