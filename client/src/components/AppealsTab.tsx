import { BsWatch } from "react-icons/bs"

const AppealsTab = () => {
  const appeals = [
    {userPicture: "", userFullname: "James", username: "@james", banReason: "Spam content", appealMessage: "I apologized for the spam content and was testing the platform and realized i violated clivo rules"}
  ] 

  return (
    <section className="bg-mutedLight border-1 border-muted rounded-lg mt-6 mb-10 p-4">
      <h1 className="font-inter">Appeals Management</h1>
      <p className="font-exo text-sm text-accent">Review and manage appeals from banned users</p>

      {/* appeals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4">
        {appeals.map((appeal, index) => <AppealDisplay key={index} appeal={appeal} />)}
      </div>
    </section>
  )
}

const AppealDisplay = ({ appeal }: { appeal: any }) => {
  return (
    <div className="bg-white p-4 rounded-lg border-1 border-muted">
      <div className="sm:flex-between gap-1">
        <div className="flex-start gap-2">
          {/* picture */}
          <div className="h-9 w-9 bg-muted border-1 border-accentLight rounded-full">
            
          </div>

          {/* name & email */}
          <div className="font-inter mt-1">
            <p>{appeal.userFullname}</p>
            <p className="text-accent text-sm">{appeal.username}</p>
          </div>
        </div>

        <button className="bg-white border-1 border-primary font-exo py-1 px-3 rounded-lg max-sm:mt-4 flex-center gap-1">
          <BsWatch size={15} />
          <p className="text-[12px]">Pending</p>
        </button>
      </div>

      <div className="mt-4">
        <p className="font-inter">Banned for: <span className="bg-pink-600 text-white text-sm font-exo py-1 px-2 rounded-lg">{appeal.banReason}</span></p>
      </div>

      <div className="mt-4">
        <p className="font-inter">Appeal Message</p>
        <p className="text-sm text-accent font-exo mt-2">{appeal.appealMessage}</p>
      </div>

      <button className="btn-primary text-sm font-exo mt-4">Review Appeal</button>
    </div>
  )
}

export default AppealsTab