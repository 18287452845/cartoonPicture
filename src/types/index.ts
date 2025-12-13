export interface UploadResponse {
  success: boolean
  url?: string
  key?: string
  error?: string
}

export interface GenerateResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

export interface AliImageGenerationRequest {
  model: string
  input: {
    image_url: string
    style_index?: number
  }
  parameters?: {
    style?: string
    [key: string]: any
  }
}

export interface AliImageGenerationResponse {
  output?: {
    task_status?: string
    task_id?: string
    results?: Array<{
      url: string
    }>
    error_message?: string
    error_code?: number
  }
  request_id?: string
  message?: string
  code?: string
}
