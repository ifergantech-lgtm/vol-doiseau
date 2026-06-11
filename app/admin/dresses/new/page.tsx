import DressForm from '../DressForm'
import { AdminTitle } from '../../adminI18n'

export default function NewDressPage() {
  return (
    <div>
      <AdminTitle k="addDressTitle" />
      <DressForm />
    </div>
  )
}
