import Footer from "~/components/common/footer"
import Header from "~/components/common/header"
import CustomHead from "~/components/custom-head"
import UserLikes from "~/components/forms/user-likes"

export default function Likes() {
	return (
		<div className="flex min-h-screen flex-col">
			<CustomHead />
			<main className="flex h-full flex-col">
				<Header />

				<UserLikes />
			</main>

			<Footer />
		</div>
	)
}
