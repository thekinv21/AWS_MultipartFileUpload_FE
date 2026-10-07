<div align="center">

# S3 Multipart Upload — Frontend

**A resilient drag-and-drop uploader for large files, built with Next.js.**

Files are split into parts and sent from the browser straight to AWS S3,
in parallel and with automatic retries. The backend only signs the requests.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Zod](https://img.shields.io/badge/Zod-4-3E67B1?logo=zod&logoColor=white)](https://zod.dev)

</div>

![Uploader with selected files and public/private toggles](docs/images/fe-selected.png)

## Backend Repository

[Github Repository](https://github.com/thekinv21/AWS_MultipartFileUpload_BE)

## Overview

This is the client for the [AWS S3 Multipart Upload API](../aws_file_upload). It lets users pick files, decide per file whether it should be public or private, and upload everything in one go with a single progress bar.

Large uploads in the browser fail in predictable ways: connections drop, tabs are closed, a single slow request blocks everything. The uploader is built around those failure modes:

| Problem                              | How the uploader handles it                                             |
| ------------------------------------ | ----------------------------------------------------------------------- |
| One large request is fragile         | Files are split into parts using the `chunkSize` from the backend       |
| Uploads are slow over one connection | 4 parts are uploaded in parallel                                        |
| Networks drop or throttle            | Each part is retried up to 3 times with exponential backoff             |
| The user changes their mind          | Cancel stops all requests and aborts the upload on S3                   |
| Invalid files waste time             | Type, size, count, name length and duplicates are checked before upload |
| Credentials must stay private        | The browser only ever sees short-lived presigned URLs                   |

## Highlights

**File selection**

- Drag and drop or "Browse files", powered by `react-dropzone`.
- Validation on add: allowed type (extension and MIME type together), maximum size, maximum file count, file name length, and duplicate detection.
- A clear notification for every rejected file, explaining why.
- Thumbnails for images and type icons for documents.

**Upload pipeline**

- Chunked multipart upload directly to S3 through presigned URLs.
- Parallel part uploads (4 at a time) with order-preserving results.
- Automatic retries for network errors, `429` and `5xx`, with backoff of 1 s and 2 s.
- Byte-accurate overall progress across all files; retried bytes are never counted twice.
- Cancel at any time; unfinished uploads are cleaned up on S3.

**Visibility**

- Every file starts as **private**; nothing becomes public without an explicit choice.
- A per-file switch marks files as **public**, which gives them a permanent URL.

**Feedback**

- Success, failure and cancellation notifications.
- Partial success reporting: if a file fails, files completed before it are removed from the list and the user is told how many made it.

## Screenshots

|                               Empty state                               |
| :---------------------------------------------------------------------: |
| ![Empty dropzone with the allowed file types](docs/images/fe-empty.png) |
|                         **Upload in progress**                          |
| ![Overall progress bar during an upload](docs/images/fe-uploading.png)  |

## Architecture

### System overview

```mermaid
flowchart LR
    User(["User"])
    FE["Next.js app<br/>(this project)"]
    API["Backend API<br/>(NestJS)"]
    S3[("AWS S3 bucket")]

    User --> FE
    FE -- "initiate / part-url / complete / abort<br/>(small JSON requests)" --> API
    API -- "Signs URLs,<br/>manages multipart upload" --> S3
    FE == "PUT part bytes<br/>(presigned URL)" ==> S3
```

### Upload sequence

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as Browser
    participant API as Backend API
    participant S3 as AWS S3

    U->>FE: Select files, set visibility, click Upload
    loop For each file, one after another
        FE->>API: POST /v1/multipart/initiate
        API-->>FE: key, uploadId, chunkSize
        par Up to 4 parts at a time
            FE->>API: POST /v1/multipart/part-url
            API-->>FE: presigned url
            FE->>S3: PUT part bytes (progress tracked)
            S3-->>FE: ETag
        end
        FE->>API: POST /v1/multipart/complete
        API-->>FE: key, name, extension, size, isPublic, url
        FE->>U: File removed from the list
    end
    FE->>U: "N files uploaded successfully"
```

If a part still fails after its retries, or the user cancels, the remaining parts are stopped and `POST /v1/multipart/abort` cleans up the upload on S3.

### Code layers

```mermaid
flowchart TB
    subgraph ui["UI"]
        Uploader["FileUploader"]
        Hook["useFileUploader<br/>(form, selection, visibility)"]
    end
    subgraph state["State"]
        Upload["useUpload<br/>(TanStack mutation, progress, cancel)"]
    end
    subgraph pipeline["Upload pipeline (lib/upload)"]
        Files["uploadFiles<br/>(files in sequence)"]
        Multipart["uploadFileInParts<br/>(initiate → parts → complete / abort)"]
        Parts["uploadParts<br/>(4 in parallel, retries)"]
    end
    Service["MultipartService<br/>(axios)"]

    Uploader --> Hook --> Upload --> Files --> Multipart --> Parts
    Multipart --> Service
    Parts --> Service
```

UI components never call the API directly. The pipeline functions are plain TypeScript, independent of React, which keeps the upload logic easy to read and test in isolation.

## Quick start

### Prerequisites

- [Bun](https://bun.sh) 1.x
- A running [backend](../aws_file_upload) (default `http://localhost:4200`)
- S3 bucket CORS that allows this app's origin and exposes the `ETag` header (see the backend's [AWS setup](../aws_file_upload/README.md#aws-setup))

### Install and run

```bash
bun install
cp .env.example .env
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

All variables are validated with Zod when the app loads; an invalid value stops the app with a clear message. See [`.env.example`](.env.example) for a template.

| Variable                           | Required | Default in example          | Description                                    |
| ---------------------------------- | :------: | --------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_API_URL`              |    ✓     | `http://localhost:4200/api` | Backend base URL, including the `/api` prefix. |
| `NEXT_PUBLIC_FILE_MAX_SIZE_BYTES`  |    ✓     | `1073741824`                | Maximum size of one file (1 GiB).              |
| `NEXT_PUBLIC_FILE_MAX_COUNT`       |    ✓     | `10`                        | Maximum number of files selected at once.      |
| `NEXT_PUBLIC_FILE_MAX_NAME_LENGTH` |    ✓     | `255`                       | Maximum file name length.                      |

> [!NOTE]
> Keep the size and name length limits in sync with `AWS_FILE_MAX_SIZE_BYTES` and `AWS_FILE_MAX_NAME_LENGTH` on the backend, and the allowed file types in [`src/constants/FileConstant.ts`](src/constants/FileConstant.ts) in sync with the backend list. These checks give users instant feedback; the backend enforces the real limits.

### Tuning the upload pipeline

The pipeline constants live in [`src/lib/upload/MultipartParts.ts`](src/lib/upload/MultipartParts.ts):

| Constant                   | Default | Effect                                       |
| -------------------------- | ------- | -------------------------------------------- |
| `PART_CONCURRENCY`         | `4`     | Parts uploaded at the same time per file     |
| `PART_RETRY_ATTEMPTS`      | `3`     | Total attempts per part, including the first |
| `PART_RETRY_BASE_DELAY_MS` | `1000`  | First retry delay; doubles on every attempt  |

The part size itself is not configured here. It comes from the backend in the `chunkSize` field of the initiate response.

## Integration

### Service API

[`MultipartService`](src/services/multipart/MultipartService.ts) wraps every backend endpoint and is exported as the `multipartService` singleton:

| Method                          | Endpoint                                                       |
| ------------------------------- | -------------------------------------------------------------- |
| `initiateMultipartUpload(body)` | `POST /v1/multipart/initiate`                                  |
| `getPresignedPartUrl(body)`     | `POST /v1/multipart/part-url`                                  |
| `uploadPart(url, chunk)`        | `PUT <presigned url>` directly to S3, bypassing the API client |
| `completeMultipartUpload(body)` | `POST /v1/multipart/complete`                                  |
| `abortMultipartUpload(body)`    | `POST /v1/multipart/abort`                                     |
| `getDownloadUrl({ key })`       | `GET /v1/multipart/download-url`                               |

### Using the upload result

Each completed file returns:

```json
{
	"key": "uploads/public/0f6c2f0e-...-mountain-sunset.png",
	"name": "mountain-sunset.png",
	"extension": "png",
	"size": 108277,
	"isPublic": true,
	"url": "https://<bucket>.s3.<region>.amazonaws.com/uploads/public/0f6c2f0e-...-mountain-sunset.png"
}
```

The backend does not store this result. It is passed to the `onFileUploaded` callback of `useUpload`, which is the place to save it to your own system:

```ts
const upload = useUpload({
	onFileUploaded: (file, uploaded) => {
		// uploaded: { key, name, extension, size, isPublic, url }
		saveToMyApi(uploaded)
	},
})
```

For private files `url` is `null`. Request a time-limited link when the user wants to download:

```ts
const url = await multipartService.getDownloadUrl({ key: uploaded.key })
window.location.assign(url)
```

## Reliability

| Behaviour                 | Detail                                                                                                                                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Retry policy**          | [`isRetryableRequestError`](src/services/instance/errorCatch.ts) retries network errors without a response, `429` and `5xx`. Other `4xx` responses and cancellations fail immediately.         |
| **Progress accuracy**     | A retried part restarts its progress from zero, so bytes from a failed attempt are not counted and the percentage never exceeds 100 %.                                                         |
| **Fail fast**             | When one part fails for good, the remaining parts of that file are aborted instead of finishing in vain.                                                                                       |
| **Cleanup**               | Any failure or cancel before completion calls `abort`, so no orphaned parts stay on S3.                                                                                                        |
| **Initiate and complete** | Both ignore the cancel signal on purpose: initiate must return an `uploadId` so a cancel can be cleaned up, and once complete starts the file is stored and must not be reported as cancelled. |
| **Navigation**            | Leaving the page is not treated as a user cancel, so no "cancelled" notification is shown.                                                                                                     |

## Project structure

```
app/
├── layout.tsx                    # Root layout, fonts, providers
└── page.tsx                      # Home page
src/
├── components/
│   ├── file-upload/              # Uploader feature
│   │   ├── FileUploader.tsx      # Card, progress bar, Upload / Cancel
│   │   ├── useFileUploader.ts    # Form, add / remove files, submit
│   │   ├── useSelectedFiles.ts   # Selected files and their visibility
│   │   ├── FileDropzone.tsx      # Drag-and-drop area
│   │   ├── FileList.tsx          # List of selected files
│   │   ├── FileListItem.tsx      # One file row
│   │   ├── FileVisibilityToggle.tsx
│   │   └── dropzone/             # Dropzone building blocks
│   └── ui/                       # Shared UI primitives (button, card, switch, toast, ...)
├── config/                       # Env schema and validation
├── constants/                    # Limits, allowed types, user-facing messages
├── hooks/
│   ├── useUpload.ts              # Upload mutation, progress, cancel, notifications
│   └── useAbortController.ts
├── lib/
│   ├── upload/                   # Upload pipeline (framework independent)
│   │   ├── UploadFiles.ts        # Sequential files, overall progress
│   │   ├── MultipartUpload.ts    # One file: initiate → parts → complete / abort
│   │   └── MultipartParts.ts     # Parallel parts with retries
│   ├── FileUtils.ts              # Validation, chunking, formatting
│   ├── PromiseUtils.ts           # mapWithConcurrency, withRetry
│   ├── ProgressUtils.ts
│   └── UploadNotifications.ts
├── providers/                    # TanStack Query client and toaster
├── services/
│   ├── instance/                 # axios instance, error helpers, retry policy
│   └── multipart/                # MultipartService
└── types/multipart/              # Request and response types
```

## Scripts

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `bun run dev`          | Start the development server |
| `bun run build`        | Create a production build    |
| `bun run start`        | Serve the production build   |
| `bun run lint`         | Lint with ESLint             |
| `bun run format`       | Format sources with Prettier |
| `bun run format:check` | Verify formatting            |
