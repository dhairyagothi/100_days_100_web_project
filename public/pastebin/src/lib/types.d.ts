export interface PasteResponseData {
	paste_id: string;
	paste_data: string;
	paste_language: string | undefined;
	created_by: string;
	created_on: string;
	delete_password: string;
}

export interface SendPasteData {
	content: string;
	language: string;
	author: string;
}
