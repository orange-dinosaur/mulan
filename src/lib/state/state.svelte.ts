import type { UserBooks } from "$lib/types/book";

type UserState = {
	user: string | undefined;
	userBooks: UserBooks | undefined;
	searchString: string;
};

function createUserState() {
	const userState: UserState = $state({
		user: undefined,
		userBooks: undefined,
		searchString: ''
	});

	return {
		get user() {
			return userState.user;
		},
		get userBooks() {
			return userState.userBooks;
		},
		get searchString() {
			return userState.searchString;
		},

		set user(user: string | undefined) {
			userState.user = user;
		},
		set userBooks(userBooks: UserBooks | undefined) {
			userState.userBooks = userBooks;
		},
		set searchString(searchString: string) {
			userState.searchString = searchString;
		},
	};
}

export const userState = createUserState();