import { BsWatch } from "react-icons/bs"
import { setAppeal, type Appeal } from "../redux/reducers/admin_reducer"
import { useDispatch, useSelector } from "react-redux";
import { shorten } from "../utils/utils";
import { useFetchAdminStats } from "../hooks/useFetchAdminStats";

interface PropsType {
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>
}

const AppealsTab = ({ setModalActive }: PropsType) => {
  const dispatch = useDispatch();
  const {} = useFetchAdminStats();

  const appeals: Appeal[] = useSelector((state: any) => state.admin.appeals);

  const handleAction = (appeal: Appeal) => {
    dispatch(setAppeal(appeal))
    setModalActive(true)
  }

  return (
    <section className="bg-mutedLight border border-muted rounded-lg lg:w-240 mx-auto mt-10 mb-10 p-4">
      <h1 className="font-inter">Appeals Management</h1>
      <p className="font-exo text-sm text-accent">Review and manage appeals from banned users</p>

      {/* appeals */}
      {appeals.length >= 1 &&
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {appeals.map((appeal, index) => {
            return <AppealDisplay key={index} appeal={appeal} action={handleAction} />
          })}
        </div>
      }
    </section>
  )
}

const AppealDisplay = ({ appeal, action }: { appeal: any, action: (appeal: Appeal) => void }) => {
  const showModal = () => {
    action(appeal)
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-muted">
      <div className="sm:flex-between gap-1">
        <div className="flex-start gap-2">
          {/* picture */}
          <div className="h-9 w-9 bg-muted border border-accentLight rounded-full">
            
          </div>

          {/* name & email */}
          <div className="font-inter mt-1">
            <p>{appeal.userFullname}</p>
            <p className="text-accent text-sm">{appeal.username}</p>
          </div>
        </div>

        <button className="bg-white border border-primary font-exo py-1 px-3 rounded-lg max-sm:mt-4 flex-center gap-1">
          <BsWatch size={15} />
          <p className="text-[12px]">Pending</p>
        </button>
      </div>

      <div className="mt-4">
        <p className="font-inter">Appeal Message</p>
        <p className="text-sm text-accent font-exo mt-2">{shorten(appeal.appealMessage, 90)}</p>
      </div>

      <button onClick={showModal} className="btn-primary text-sm font-exo mt-4">Review Appeal</button>
    </div>
  )
}

export default AppealsTab