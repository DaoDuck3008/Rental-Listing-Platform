export interface Notification {
    id: string;
    recipient_id: string;
    type: "NEW_MESSAGE" | "NEW_FAVORITE" | "NEW_APPROVED" | "NEW_REJECTED";
    content: string;
    is_read: boolean;
    reference_id: string;
    created_at: string;
    updated_at: string;
}
