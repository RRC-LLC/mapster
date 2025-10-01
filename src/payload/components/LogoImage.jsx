import Image from "next/image"
import Logo from "/public/pg_wordmark.svg";

export default function IconImage () {

    return (
    <Image
        width={200}
        height={100}
        src={Logo}
        alt="Logo"
      />
    )
}