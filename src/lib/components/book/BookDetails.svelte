<script lang="ts">
	import { BookCheck, LoaderCircle } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import * as Sheet from '$lib/components/ui/sheet';
	import { BookToSave, BookFull, BookToUpdate, UserBooks } from '$lib/types/book';
	import StarRating from '$lib/components/rating/StarRating.svelte';
	import SingleSelection from '$lib/components/selection/SingleSelection.svelte';
	import { toast } from 'svelte-sonner';
	import { userState } from '$lib/state/state.svelte';
	import { getContext } from 'svelte';
	import type { Models } from 'node-appwrite';
	import Tags from '$lib/components/tags/Tags.svelte';

	const user: Models.User<Models.Preferences> = getContext('user');
	let userBooks: UserBooks = $state(
		userState.userBooks ? userState.userBooks : new UserBooks(user.$id)
	);

	let { book, displayMode }: { book: BookFull; displayMode: 'search' | 'home' } = $props();

	let tempBookId = $state('');

	// boolean variables that define if there is an action ongoing
	let isLoadingSave = $state(false);
	let isLoadingWishlist = $state(false);
	let isLoadingUpdate = $state(false);
	let isLoadingRemove = $state(false);
	let isLoadingWhishlist = $state(false);
	let isSheetOpen = $state(false);

	// boolean variables that define is a property of the book has been changed
	let isReadingStatusChanged = $state(false);
	let isReadingStartDateChanged = $state(false);
	let isReadingEndDateChanged = $state(false);
	let isBookTypeChanged = $state(false);
	let isTagsChanged = $state(false);
	let isRatingChanged = $state(false);
	let isBookChanged = () => {
		return (
			isReadingStatusChanged ||
			isReadingStartDateChanged ||
			isReadingEndDateChanged ||
			isBookTypeChanged ||
			isTagsChanged ||
			isRatingChanged
		);
	};

	// define possible values for selection components
	const readingStatusSelection = ['to-read', 'reading', 'completed', 'dnf'];
	const bookTypeSelection = ['book', 'e-book', 'audiobook'];

	// check if the book is already in the user's library
	function checkIfBookIsAlreadySaved() {
		return userBooks.books.some((b) => b.bookId === book.bookId);
	}

	// if the book is already in the user's library,
	// set the book properties with the user's book properties
	// otherwise, set the book properties with the default values
	function defineInitialValues() {
		return {
			readingStatus: checkIfBookIsAlreadySaved() ? book.readingStatus : '',
			bookType: checkIfBookIsAlreadySaved() ? book.bookType : '',
			tags: checkIfBookIsAlreadySaved() ? book.tags : [],
			rating: checkIfBookIsAlreadySaved() ? book.rating : 0,
			readingStartDate: new Date(),
			readingEndDate: new Date()
		};
	}
	let initialValues = defineInitialValues();
	let readingStatus = $state(initialValues.readingStatus);
	let bookType = $state(initialValues.bookType);
	let tags: string[] = $state(initialValues.tags);
	let rating: number = $state(initialValues.rating);
	let readingStartDate = $state(book.readingStartDate);
	let readingEndDate = $state(book.readingEndDate);

	// functions to manage changes on book's properties
	function handleReadingStatusChange(newReadingStatus: string) {
		readingStatus = newReadingStatus;
		if (newReadingStatus !== book.readingStatus) {
			isReadingStatusChanged = true;
		} else {
			isReadingStatusChanged = false;
		}
	}
	function handleBookTypeChange(newBookType: string) {
		bookType = newBookType;
		if (newBookType !== book.bookType) {
			isBookTypeChanged = true;
		} else {
			isBookTypeChanged = false;
		}
	}
	function handleTagsChange(newTags: string[]) {
		tags = newTags;
		if (newTags !== book.tags) {
			isTagsChanged = true;
		} else {
			isTagsChanged = false;
		}
	}
	function handleRatingChange(newRating: number) {
		rating = newRating;
		if (newRating !== book.rating) {
			isRatingChanged = true;
		} else {
			isRatingChanged = false;
		}
	}

	// save the book to the user's library
	async function saveBookToLibrary() {
		const bookToSave = new BookToSave({
			bookId: book.bookId,
			readingStatus,
			bookType,
			tags,
			rating
		}).toJSON();

		// set the userId of the book to be saved to the current user's id
		bookToSave.userId = user.$id;

		isLoadingSave = true;

		const res = await fetch('/api/save-book', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bookToSave)
		});

		if (!res.ok) {
			toast.error('Error updating book');
		} else {
			// get the book from the response
			const savedBookId = await res.json();

			// create a bookFull object
			const SavedBookFull = new BookFull({
				id: savedBookId.id,
				title: book.title,
				authors: book.authors,
				publisher: book.publisher,
				publishedDate: book.publishedDate,
				description: book.description,
				pageCount: book.pageCount,
				categories: book.categories,
				language: book.language,
				cover: book.cover,
				...bookToSave
			});

			// update user state
			// TODO: find a better way to update the user state
			userBooks.books = [...userBooks.books, SavedBookFull];
			userState.userBooks = userBooks;

			// update the tempBookId so that it can be used to update the book before the user refreshes the page
			tempBookId = savedBookId.id;

			toast.success('Book saved successfully');

			// reset the values of the isChanged variables
			isReadingStatusChanged = false;
			isReadingStartDateChanged = false;
			isReadingEndDateChanged = false;
			isBookTypeChanged = false;
			isTagsChanged = false;
			isRatingChanged = false;
		}

		/* isAlreadySaved = true; */
		isLoadingSave = false;
	}

	// update the book in the user's library
	async function updateBookInLibrary() {
		// create a book to update object setting only the fields that have changed
		const bookToUpdate = new BookToUpdate({
			readingStatus: isReadingStatusChanged ? readingStatus : undefined,
			readingStartDate: isReadingStartDateChanged ? readingStartDate.toDateString() : undefined,
			readingEndDate: isReadingEndDateChanged ? readingEndDate.toDateString() : undefined,
			bookType: isBookTypeChanged ? bookType : undefined,
			tags: isTagsChanged ? tags : undefined,
			rating: isRatingChanged ? rating : undefined,
			notes: undefined,
			libraryId: undefined
		});
		const bookToUpdateJSON = bookToUpdate.toJSON();

		isLoadingUpdate = true;

		let bookIdToUpdate = book.id === '' ? tempBookId : book.id;

		const res = await fetch(`/api/update-book/${user.$id}/${bookIdToUpdate}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(bookToUpdateJSON)
		});

		if (!res.ok) {
			toast.error('Error updating book');
		} else {
			// update user state
			// TODO: find a better way to update the user state
			const updatedBooksJSON = userBooks.books.map((b) => {
				if (b.id === bookIdToUpdate) {
					return {
						...b,
						...bookToUpdateJSON
					};
				}
				return b;
			});
			const updatedBooks = updatedBooksJSON.map((b) => BookFull.fromJSON(b));
			userBooks.books = updatedBooks;
			userState.userBooks = userBooks;

			toast.success('Book updated successfully');

			// reset the values of the isChanged variables
			isReadingStatusChanged = false;
			isReadingStartDateChanged = false;
			isReadingEndDateChanged = false;
			isBookTypeChanged = false;
			isTagsChanged = false;
			isRatingChanged = false;
		}

		isLoadingUpdate = false;
	}

	async function removeBookFromLibrary() {
		isLoadingRemove = true;

		let bookIdToDelete = book.id === '' ? tempBookId : book.id;

		const res = await fetch(`/api/remove-book/${user.$id}/${bookIdToDelete}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!res.ok) {
			// display error
			toast.error('Error deleting book');
		} else {
			// update user state
			// TODO: find a better way to update the user state
			const updatedBooks = userBooks.books.filter((b) => b.id !== bookIdToDelete);
			userBooks.books = updatedBooks;
			userState.userBooks = userBooks;

			toast.success('Book deleted successfully');

			isSheetOpen = false;
		}

		isSheetOpen = false;
		/* isAlreadySaved = false; */
		isLoadingRemove = false;
	}
</script>

<div class="mt-4 flex justify-start">
	<Sheet.Root open={isSheetOpen}>
		{#if displayMode === 'home'}
			<Sheet.Trigger
				on:click={() => {
					isSheetOpen = true;
				}}
				class="cursor-pointer text-sm font-semibold text-primary"
				><div class="mr-6 flex w-72 max-w-72 flex-col">
					<!-- Book cover -->
					<div class="mb-4">
						<img src={book.cover} alt={book.title} class="h-56 w-auto" />
					</div>

					<div class="mr-10 mt-2 flex flex-col justify-start">
						<!-- Book -->
						<div class="text-left">
							<h2 class="mb-2 min-h-12 text-base font-semibold">{book.title}</h2>

							<p class="mb-2 mt-1 text-sm text-muted-foreground">{book.authors}</p>
							<div class="mt-1">
								{#if book.publisher}
									<p class="mr-1 text-sm text-muted-foreground">{book.publisher}</p>
								{/if}
								<p class="text-sm text-muted-foreground">({book.publishedDate})</p>
							</div>
						</div>

						<!-- Book details -->
						<p class="pt-4 text-left">+ Details</p>
					</div>
				</div></Sheet.Trigger
			>
		{:else if displayMode === 'search'}
			<Sheet.Trigger
				on:click={() => {
					isSheetOpen = true;
				}}
				class="cursor-pointer text-sm font-semibold text-primary"
			>
				<div class="flex justify-start">
					<!-- Book cover -->
					<div class="mb-4 h-full min-w-44">
						<img src={book.cover} alt={book.title} class="h-56 w-auto" />
					</div>

					<div class="ml-8 flex w-4/5 flex-col justify-start">
						<!-- Book -->
						<div class="text-left">
							<div class="flex items-center">
								<h2 class="text-xl font-semibold">{book.title}</h2>
								{#if checkIfBookIsAlreadySaved()}
									<BookCheck class="w-h-5 ml-2 h-5 text-primary" />
								{/if}
							</div>
							<p class="mt-1 text-base text-muted-foreground">{book.authors}</p>
							<div class="mt-2">
								{#if book.publisher}
									<p class="mr-2 text-sm text-muted-foreground">{book.publisher}</p>
								{/if}
								<p class="text-sm text-muted-foreground">({book.publishedDate})</p>
							</div>
						</div>

						<!-- Book details -->
						<p class="pt-4 text-left">+ Details</p>
					</div>
				</div>
			</Sheet.Trigger>
		{/if}

		<Sheet.Content class="min-w-[800px] p-16">
			<ScrollArea class="h-[105%] w-full">
				<div class="flex w-full items-start justify-start">
					<!-- Book Cover -->
					<img src={book.cover} alt={book.title} class="mb-8 h-60 w-auto" />

					<!-- Actions -->
					<div class="ml-8 flex h-60 flex-col justify-end">
						{#if checkIfBookIsAlreadySaved()}
							<!-- Update book -->
							<Button
								class="mb-2"
								disabled={!isBookChanged() ||
									isLoadingUpdate ||
									isLoadingRemove ||
									isLoadingWhishlist}
								onclick={updateBookInLibrary}
								>{#if isLoadingUpdate}
									<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
								{/if}
								Update Book
							</Button>

							<!-- Delete book -->
							<Button
								class="mb-2"
								disabled={isLoadingUpdate || isLoadingRemove || isLoadingWhishlist}
								onclick={removeBookFromLibrary}
								variant="destructive"
							>
								{#if isLoadingRemove}
									<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
								{/if}
								Remove from library
							</Button>
						{:else}
							<!-- Save book -->
							<Button
								class="mb-2"
								disabled={isLoadingSave || isLoadingWishlist}
								onclick={saveBookToLibrary}
								>{#if isLoadingSave}
									<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
								{/if}
								Add to library
							</Button>
						{/if}

						<!-- TODO: Create function -->
						<!-- <Button variant="outline" disabled={isLoadingSave || isLoadingWishlist}
							>{#if isLoadingWishlist}
								<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
							{/if}
							Save to whishlist
						</Button> -->
					</div>
				</div>

				<Sheet.Header>
					<!-- Book Title -->
					<div class="flex items-center">
						<Sheet.Title>{book.title}</Sheet.Title>
						{#if checkIfBookIsAlreadySaved() && displayMode === 'search'}
							<BookCheck class="w-h-5 ml-2 h-5 text-primary" />
						{/if}
					</div>

					<Sheet.Description>
						<!-- Book Authors and Publishing info -->
						<p class="text-base text-muted-foreground">{book.authors}</p>
						<div class="mb-4 mt-2 flex">
							{#if book.publisher}
								<p class="mr-2 text-sm text-muted-foreground">{book.publisher}</p>
							{/if}
							<p class="text-sm text-muted-foreground">({book.publishedDate})</p>
						</div>

						<!-- Book Details: ISBN, Pages and Language -->
						<div class="flex flex-col items-start">
							<div class="mb-1 flex">
								<p class="mr-2 text-sm font-semibold text-muted-foreground">ISBN:</p>
								<p class="text-sm text-muted-foreground">
									{book.isbn13 != '' ? book.isbn13 : book.isbn10}
								</p>
							</div>
							<div class="mb-1 flex">
								<p class="mr-2 text-sm font-semibold text-muted-foreground">Pages:</p>
								<p class="text-sm text-muted-foreground">
									{book.pageCount}
								</p>
							</div>
							<div class="flex">
								<p class="mr-2 text-sm font-semibold text-muted-foreground">Language:</p>
								<p class="text-sm text-muted-foreground">
									{book.language}
								</p>
							</div>
						</div>

						<!-- Book Description -->
						<ScrollArea class="mt-6 h-28 min-h-28 w-full text-sm text-muted-foreground"
							>{book.description}</ScrollArea
						>
					</Sheet.Description>
				</Sheet.Header>

				<div class="mt-6 flex flex-col border-t-2 border-primary">
					<!-- Reading Status -->
					<div class="mt-6 flex items-center">
						<p class="mr-2 text-sm font-semibold text-muted-foreground">Reading status:</p>
						<SingleSelection
							possibleSelections={readingStatusSelection}
							selection={readingStatus}
							onSelectionChange={handleReadingStatusChange}
						/>
					</div>

					<!-- Book Type -->
					<div class="mb-4 mt-1 flex items-center">
						<p class="mr-2 text-sm font-semibold text-muted-foreground">Book type:</p>
						<SingleSelection
							possibleSelections={bookTypeSelection}
							selection={bookType}
							onSelectionChange={handleBookTypeChange}
						/>
					</div>

					<!-- Tags -->
					<Tags {tags} onTagsChange={handleTagsChange} />

					<!-- Rating -->
					<div class="mt-6 flex">
						<!-- <StarRating /> -->
						<StarRating {rating} onRatingChange={handleRatingChange} stars="5" />
					</div>
				</div>
			</ScrollArea>
		</Sheet.Content>
	</Sheet.Root>
</div>
