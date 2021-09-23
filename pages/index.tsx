import { Dialog, Transition } from '@headlessui/react'
import { CogIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import React, { Fragment, useEffect, useState } from 'react'
import { useS3Upload } from '../hooks/use-s3-upload'
import users from '../mocks/users'

const navigation = [{ name: 'Buckets', href: '#', icon: CogIcon }]
const subNavigation = [
  {
    name: 'Amazon S3',
    description: 'Uploading files with Amazon S3 Example.',
    href: '/',
    icon: CogIcon,
    current: true
  }
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

// function getLastFile(files: string | any[]) {
//   return files.at(-1)
// }

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  let [s3ImageUrl, setS3ImageUrl] = useState('')
  let { FileInput, openFileDialog, uploadToS3, files } = useS3Upload()
  // const [currentFile, setCurrentFile] = useState<any>(null)

  console.log(files)

  // useEffect(() => {
  //   if (files.length) {
  //     setCurrentFile(getLastFile(files))
  //   }
  // }, [files])

  let handleFileChange = async (file: File) => {
    let { url } = await uploadToS3(file, `profile/${users[0].id}`)
    setS3ImageUrl(url)
  }

  return (
    <div className='relative h-screen flex bg-blue-gray-50 overflow-hidden'>
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as='div' className='fixed inset-0 flex z-40 lg:hidden' onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <Dialog.Overlay className='fixed inset-0 bg-blue-gray-600 bg-opacity-75' />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter='transition ease-in-out duration-300 transform'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'>
            <div className='relative flex-1 flex flex-col max-w-xs w-full bg-white focus:outline-none'>
              <Transition.Child
                as={Fragment}
                enter='ease-in-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in-out duration-300'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'>
                <div className='absolute top-0 right-0 -mr-12 pt-4'>
                  <button
                    type='button'
                    className='ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                    onClick={() => setMobileMenuOpen(false)}>
                    <span className='sr-only'>Close sidebar</span>
                    <XIcon className='h-6 w-6 text-white' aria-hidden='true' />
                  </button>
                </div>
              </Transition.Child>
              <div className='pt-5 pb-4'>
                <div className='flex-shrink-0 flex items-center px-4'>
                  <img
                    className='h-8 w-auto'
                    src='https://tailwindui.com/img/logos/workflow-mark.svg?color=blue&shade=600'
                    alt='Workflow'
                  />
                </div>
                <nav aria-label='Sidebar' className='mt-5'>
                  <div className='px-2 space-y-1'>
                    {navigation.map(item => (
                      <a
                        key={item.name}
                        href={item.href}
                        className='group p-2 rounded-md flex items-center text-base font-medium text-blue-gray-600 hover:bg-blue-gray-50 hover:text-blue-gray-900'>
                        <item.icon
                          className='mr-4 h-6 w-6 text-blue-gray-400 group-hover:text-blue-gray-500'
                          aria-hidden='true'
                        />
                        {item.name}
                      </a>
                    ))}
                  </div>
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className='flex-shrink-0 w-14' aria-hidden='true'>
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className='hidden lg:flex lg:flex-shrink-0'>
        <div className='flex flex-col w-20'>
          <div className='flex-1 flex flex-col min-h-0 overflow-y-auto bg-blue-600'>
            <div className='flex-1 flex flex-col'>
              <div className='flex-shrink-0 bg-blue-700 py-4 flex items-center justify-center'>
                <img
                  className='h-8 w-auto'
                  src='https://tailwindui.com/img/logos/workflow-mark.svg?color=white'
                  alt='Workflow'
                />
              </div>
              <nav aria-label='Sidebar' className='py-6 flex flex-col items-center space-y-3'>
                {navigation.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    className='flex items-center p-4 rounded-lg text-blue-200 hover:bg-blue-700'>
                    <item.icon className='h-6 w-6' aria-hidden='true' />
                    <span className='sr-only'>{item.name}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className='flex-1 min-w-0 flex flex-col overflow-hidden'>
        {/* Mobile top navigation */}
        <div className='lg:hidden'>
          <div className='bg-blue-600 py-2 px-4 flex items-center justify-between sm:px-6'>
            <div>
              <img
                className='h-8 w-auto'
                src='https://tailwindui.com/img/logos/workflow-mark.svg?color=white'
                alt='Workflow'
              />
            </div>
            <div>
              <button
                type='button'
                className='-mr-3 h-12 w-12 inline-flex items-center justify-center bg-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                onClick={() => setMobileMenuOpen(true)}>
                <span className='sr-only'>Open sidebar</span>
                <MenuIcon className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
          </div>
        </div>

        <main className='flex-1 flex overflow-hidden'>
          <div className='flex-1 flex flex-col overflow-y-auto xl:overflow-hidden'>
            {/* Breadcrumb */}
            <nav aria-label='Breadcrumb' className='bg-white border-b border-blue-gray-200 xl:hidden'>
              <div className='max-w-3xl mx-auto py-3 px-4 flex items-start sm:px-6 lg:px-8'>
                <a href='#' className='-ml-1 inline-flex items-center space-x-3 text-sm font-medium text-blue-gray-900'>
                  <ChevronLeftIcon className='h-5 w-5 text-blue-gray-400' aria-hidden='true' />
                  <span>Buckets</span>
                </a>
              </div>
            </nav>

            <div className='flex-1 flex xl:overflow-hidden'>
              {/* Secondary sidebar */}
              <nav
                aria-label='Sections'
                className='hidden flex-shrink-0 w-96 bg-white border-r border-blue-gray-200 xl:flex xl:flex-col'>
                <div className='flex-shrink-0 h-16 px-6 border-b border-blue-gray-200 flex items-center'>
                  <p className='text-lg font-medium text-blue-gray-900'>Services</p>
                </div>
                <div className='flex-1 min-h-0 overflow-y-auto'>
                  {subNavigation.map(item => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-blue-50 bg-opacity-50' : 'hover:bg-blue-50 hover:bg-opacity-50',
                        'flex p-6 border-b border-blue-gray-200'
                      )}
                      aria-current={item.current ? 'page' : undefined}>
                      <item.icon className='flex-shrink-0 -mt-0.5 h-6 w-6 text-blue-gray-400' aria-hidden='true' />
                      <div className='ml-3 text-sm'>
                        <p className='font-medium text-blue-gray-900'>{item.name}</p>
                        <p className='mt-1 text-blue-gray-500'>{item.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </nav>

              {/* <span className='ml-4'>{currentFile ? currentFile.progress : '0'}</span> */}

              {/* Main content */}
              <div className='flex-1 max-h-screen xl:overflow-y-auto'>
                <div className='max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8'>
                  <h1 className='text-3xl font-extrabold text-blue-gray-900'>Amazon S3</h1>

                  <div className='sm:col-span-6 py-4'>
                    <label htmlFor='photo' className='block text-sm font-medium text-blue-gray-900'>
                      Foto de Perfil
                    </label>
                    <div className='mt-1 flex items-center'>
                      {s3ImageUrl ? (
                        <img className='inline-block h-12 w-12 rounded-full' src={s3ImageUrl} alt='' />
                      ) : (
                        <img
                          className='inline-block h-12 w-12 rounded-full'
                          src='https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80'
                          alt=''
                        />
                      )}

                      <div className='ml-4 flex'>
                        <div className='relative bg-white py-2 px-3 border border-blue-gray-300 rounded-md shadow-sm flex items-center cursor-pointer hover:bg-blue-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-blue-gray-50 focus-within:ring-blue-500'>
                          <span className='sr-only'> user photo</span>
                          <FileInput
                            onChange={handleFileChange}
                            className='absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md'
                          />
                          <button onClick={openFileDialog}>Upload</button>
                        </div>

                        <span className='ml-4'>{s3ImageUrl}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
