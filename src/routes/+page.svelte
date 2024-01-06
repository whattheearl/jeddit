<script>
    import { base } from "$app/paths";
import { page } from "$app/stores";
</script>

<div style="display: flex; padding: 0 16px;">
    <div style="display: flex; width: 100%;">
        <div style="margin: 16px 0;">jeddit</div>

        <a href={`${base}/auth/signin`} style="display: flex; align-items: center; margin: 16px 0 16px auto">signin</a>
        <!-- <div id="username" style="display: flex; align-items: center; margin: 16px 0 16px auto">{$page.data.user.name}</div> -->
    </div>
</div>

<form method="POST" style="padding: 16px; border: 1px solid black;">
    <div style="display: flex; align-items: center;">
        <label for="post" style="padding-right: 4px;">Create Post</label>
        <input id="post" name="post" type="text" style="font-size: 24px;">
        <button type="submit" style="height: 33.5px">submit</button>
    </div>
</form>

<article style="border: 1px solid black; margin: 16px 0; padding: 8px;">
    <h2 style="margin-bottom: 16px;">Hello world!</h2>
    <p>Just some palce holder text. Don't worry about it...</p>
</article>
