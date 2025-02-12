<script>
  import Sortable from 'sortablejs';
  import { onMount } from "svelte";

	let foo;
	export let input;
	function arrayMove(orig, fromIndex, toIndex) {
    let arr = JSON.parse(JSON.stringify(orig));
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
  }
	$:{
    console.log(input);
  }
	$: stages= [
		{ data: 'a' },
		{ data: 'b' },
		{ data: 'c' },
	];
	let sortable;
	onMount(async function() {
		sortable= Sortable.create(foo, {
			group: 'foo',
			animation: 100
		});
	});
	
	const sort= e=> {
		let newStages = arrayMove(
			[...stages], 
			e.oldIndex, 
			e.newIndex
		);
		stages= newStages;
	};
</script>

<ul bind:this={foo}
	on:sort={sort}>
	{#each stages as stage}
		<li :key={stage.data}>
      <input type="text" value={stage.data}><input type="checkbox">
    </li>
	{/each}
</ul>


<style>
	ul {
		list-style: none;
		padding: 0;
	}

	li {
		background: #eee;
	}
</style>