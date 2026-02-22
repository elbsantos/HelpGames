CREATE TABLE `betblocker_activations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`platform` enum('windows','macos','ios','android') NOT NULL,
	`activated_at` timestamp NOT NULL DEFAULT (now()),
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `betblocker_activations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blockage_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`blockage_type` enum('helpgames_30min','betblocker_permanent','both') NOT NULL,
	`status` enum('active','completed','cancelled') NOT NULL DEFAULT 'active',
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`ended_at` timestamp,
	`duration_minutes` int,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blockage_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `financial_profiles` ADD `notified_at_80_percent` timestamp;--> statement-breakpoint
ALTER TABLE `financial_profiles` ADD `notified_at_95_percent` timestamp;--> statement-breakpoint
ALTER TABLE `financial_profiles` ADD `last_monthly_report_sent` timestamp;--> statement-breakpoint
ALTER TABLE `financial_profiles` ADD `monthly_report_enabled` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `betblocker_activations` ADD CONSTRAINT `betblocker_activations_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `blockage_history` ADD CONSTRAINT `blockage_history_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;