import { useParams } from 'next/navigation'
import VerifyForm from './_components/form_verify'
type Props = {
    params: Promise<{
        _id:string
    }>
}
const VerifyCodeIdPage = async ({params}:Props) => {
  const _id = (await (params))._id
  return (
    <>
      <VerifyForm _id={_id}/>
    </>
  )
}

export default VerifyCodeIdPage
