import { TextFieldServerProps } from 'payload'
import "./styles.scss"

export const YoutubeEmbed: React.FC<TextFieldServerProps> = ({ data, field: { label } }) => {

  return <>
    <div className="flex label w-full items-end pb-2 justify-between">
      <div>Video</div>
    </div>
    {data.youtube_id && <iframe width="420" height="315" className="w-full h-auto aspect-video rounded-b" src={`https://www.youtube.com/embed/${data.youtube_id}`} />}
  </>
}