import S3 from 'aws-sdk/clients/s3'
import React, { ChangeEvent, forwardRef, useRef, useState } from 'react'

type FileInputProps = {
  onChange: (file: File | undefined, event: ChangeEvent<HTMLInputElement>) => void
  [index: string]: any // Indexer to spread props
}

let FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ onChange = () => {}, ...restOfProps }, forwardedRef) => {
    let handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
      let file = event.target?.files?.[0]
      onChange(file, event)
    }

    return <input onChange={handleChange} {...restOfProps} ref={forwardedRef} type='file' />
  }
)

type TrackedFile = {
  file: File
  progress: number
  uploaded: number
  size: number
}

export const useS3Upload = () => {
  let ref = useRef<HTMLInputElement>()
  let [files, setFiles] = useState<TrackedFile[]>([])
  let [currentFile, setCurrentFile] = useState<TrackedFile>()

  let openFileDialog = () => {
    if (ref.current) {
      ref.current.value = ''
      ref.current?.click()
    }
  }

  let uploadToS3 = async (file: File, path: string) => {
    let filename = encodeURIComponent(file.name)
    let res = await fetch(`/api/s3-upload?filename=${filename}&path=${path}`)
    let data = await res.json()

    if (data.error) {
      console.error('data', data.error)
      throw data.error
    } else {
      let s3 = new S3({
        accessKeyId: data.token.Credentials.AccessKeyId,
        secretAccessKey: data.token.Credentials.SecretAccessKey,
        sessionToken: data.token.Credentials.SessionToken,
        region: data.region
      })

      let params = {
        ACL: 'public-read',
        Bucket: data.bucket,
        Key: data.key,
        Body: file,
        CacheControl: 'max-age=630720000, public',
        ContentType: file.type
      }

      // at some point make this configurable
      // let uploadOptions = {
      //   partSize: 100 * 1024 * 1024,
      //   queueSize: 1,
      // };

      let s3Upload = s3.upload(params)

      setFiles(files => [...files, { file, progress: 0, uploaded: 0, size: file.size }])
      setCurrentFile({ file, progress: 0, uploaded: 0, size: file.size })

      s3Upload.on('httpUploadProgress', event => {
        if (event.total) {
          setCurrentFile({
            file,
            uploaded: event.loaded,
            size: event.total,
            progress: (event.loaded / event.total) * 100
          })
          setFiles(files =>
            files.map(trackedFile =>
              trackedFile.file === file
                ? {
                    file,
                    uploaded: event.loaded,
                    size: event.total,
                    progress: (event.loaded / event.total) * 100
                  }
                : trackedFile
            )
          )
        }
      })

      let uploadResult = await s3Upload.promise()

      return {
        files,
        url: uploadResult.Location,
        bucket: uploadResult.Bucket,
        key: uploadResult.Key
      }
    }
  }

  return {
    FileInput: (props: any) => <FileInput {...props} ref={ref} style={{ display: 'none' }} />,
    openFileDialog,
    uploadToS3,
    currentFile,
    files
  }
}
