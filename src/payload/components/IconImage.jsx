import Image from "next/image"
import Icon from "/public/ampersand.svg";

export default function IconImage () {

    return (
    <Image
        width={25}
        height={25}
        src={Icon}
        alt="Logo"
      />
    )
}