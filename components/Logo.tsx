import Image from 'next/image'

const Logo = () => {
  return (
    <Image
      src="/static/images/outfitz-logo.png"  // or whatever your image file name is
      alt="Outfitz Logo"
      width={120}
      height={40}
      priority
    />
  )
}

export default Logo