CREATE TABLE `leisure_allocation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`betting_percentage` int NOT NULL DEFAULT 10,
	`cinema_percentage` int NOT NULL DEFAULT 20,
	`hobbies_percentage` int NOT NULL DEFAULT 30,
	`travel_percentage` int NOT NULL DEFAULT 20,
	`other_percentage` int NOT NULL DEFAULT 20,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leisure_allocation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `leisure_allocation` ADD CONSTRAINT `leisure_allocation_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;