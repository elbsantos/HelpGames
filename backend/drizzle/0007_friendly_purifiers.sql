ALTER TABLE `users` ADD `stripe_customer_id` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `stripe_subscription_id` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `plan` enum('free','premium') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `plan_country` varchar(2);--> statement-breakpoint
ALTER TABLE `users` ADD `plan_interval` enum('monthly','annual');--> statement-breakpoint
ALTER TABLE `users` ADD `plan_expires_at` timestamp;