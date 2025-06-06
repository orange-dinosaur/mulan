<script lang="ts">
	let { rating, onRatingChange, stars } = $props();

	let selectedRating: number = $state(rating as number);

	const roundedRating = Math.round((rating as number) * 2) / 2;
	const roundedStars = Math.floor(stars as number);

	function handleRatingChange(rating: number) {
		(onRatingChange as (rating: number) => void)(rating);
	}
</script>

<svg
	aria-hidden="true"
	style="position: absolute; width: 0; height: 0; overflow: hidden;"
	version="1.1"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
>
	<defs>
		<symbol id="icon-star" viewBox="0 0 26 28">
			<path
				d="M26 10.109c0 0.281-0.203 0.547-0.406 0.75l-5.672 5.531 1.344 7.812c0.016 0.109 0.016 0.203 0.016 0.313 0 0.406-0.187 0.781-0.641 0.781-0.219 0-0.438-0.078-0.625-0.187l-7.016-3.687-7.016 3.687c-0.203 0.109-0.406 0.187-0.625 0.187-0.453 0-0.656-0.375-0.656-0.781 0-0.109 0.016-0.203 0.031-0.313l1.344-7.812-5.688-5.531c-0.187-0.203-0.391-0.469-0.391-0.75 0-0.469 0.484-0.656 0.875-0.719l7.844-1.141 3.516-7.109c0.141-0.297 0.406-0.641 0.766-0.641s0.625 0.344 0.766 0.641l3.516 7.109 7.844 1.141c0.375 0.063 0.875 0.25 0.875 0.719z"
			></path>
		</symbol>
		<symbol id="icon-star-half" viewBox="0 0 13 28">
			<path
				d="M13 0.5v20.922l-7.016 3.687c-0.203 0.109-0.406 0.187-0.625 0.187-0.453 0-0.656-0.375-0.656-0.781 0-0.109 0.016-0.203 0.031-0.313l1.344-7.812-5.688-5.531c-0.187-0.203-0.391-0.469-0.391-0.75 0-0.469 0.484-0.656 0.875-0.719l7.844-1.141 3.516-7.109c0.141-0.297 0.406-0.641 0.766-0.641v0z"
			></path>
		</symbol>
	</defs>
</svg>

<div class="comment-stars">
	{#each Array.from({ length: roundedStars * 2 }, (_, i) => i) as star}
		<input
			class="comment-stars-input"
			type="radio"
			name="rating"
			value={(roundedStars * 2 - star) / 2}
			id="rating-{(roundedStars * 2 - star) / 2}"
			checked={(roundedStars * 2 - star) / 2 === roundedRating}
			bind:group={selectedRating}
			onchange={() => {
				handleRatingChange(selectedRating as number);
			}}
		/>
		<label
			class={((roundedStars * 2 - star) / 2) % 1 === 0
				? 'comment-stars-view'
				: 'comment-stars-view is-half'}
			for="rating-{(roundedStars * 2 - star) / 2}"
		>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<svg
				class={((roundedStars * 2 - star) / 2) % 1 === 0 ? 'icon icon-star' : 'icon icon-star-half'}
				ondblclick={() => {
					selectedRating = 0;
					handleRatingChange(selectedRating as number);
				}}
			>
				<use
					xlink:href={((roundedStars * 2 - star) / 2) % 1 === 0 ? '#icon-star' : '#icon-star-half'}
				></use>
			</svg></label
		>
	{/each}
</div>

<style>
	:root {
		--color-gold: #ffc41f;
		--color-gold-light: #ffd560;
	}

	.comment-stars {
		display: flex;
		flex-direction: row-reverse;
	}

	.comment-stars-input {
		display: none;
	}

	.comment-stars-input:checked ~ .comment-stars-view svg {
		fill: var(--color-gold);
	}

	.comment-stars-input:checked ~ .comment-stars-view:hover svg,
	.comment-stars-input:checked ~ .comment-stars-view:hover ~ .comment-stars-view svg {
		fill: var(--color-gold-light);
	}

	.comment-stars-view {
		cursor: pointer;
	}

	.comment-stars-view svg {
		fill: #d9d9d9;
		width: 1.39306640625em;
		height: 1.5em;
	}

	.comment-stars-view.is-half {
		transform: translateX(100%);
		margin-left: -0.69580078125em;
	}

	.comment-stars-view.is-half svg {
		width: 0.69580078125em;
	}

	.comment-stars-view:hover svg,
	.comment-stars-view:hover ~ .comment-stars-view svg {
		fill: var(--color-gold-light);
	}
</style>
