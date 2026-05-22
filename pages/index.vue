<template>
  <h1 className="text-3xl">Hello from Vue!</h1>
<!-- Font sizes -->
<p class="n:text-xxxl">.n:text-xxxl - The quick brown fox</p>
<p class="n:text-xxl">.n:text-xxl - The quick brown fox</p>
<p class="n:text-xl">.n:text-xl - The quick brown fox</p>
<p class="n:text-l">.n:text-l - The quick brown fox</p>
<p class="n:text-m">.n:text-m - The quick brown fox</p>
<p class="n:text-s">.n:text-s - The quick brown fox</p>
<p class="n:text-xs">.n:text-xs - The quick brown fox</p>

<hr class="n:divider" />

<!-- Font weights -->
<p class="n:font-default">.n:font-default - The quick brown fox</p>
<p class="n:font-active">.n:font-active - The quick brown fox</p>
<p class="n:font-heading">.n:font-heading - The quick brown fox</p>
<p class="n:font-strong">.n:font-strong - The quick brown fox</p>

<hr class="n:divider" />

<!-- Font families -->
<p class="n:font-sans">.n:font-sans - The quick brown fox jumps over the lazy dog</p>
<p class="n:font-mono">.n:font-mono - The quick brown fox jumps over the lazy dog</p>

<hr class="n:divider" />

<!-- Line heights -->
<p class="n:text-l n:leading-tight">
  .n:leading-tight - Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt amet ipsam enim sed sequi
  voluptatibus.
</p>
<p class="n:text-l n:leading-heading">
  .n:leading-heading - Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt amet ipsam enim sed sequi
  voluptatibus.
</p>
<p class="n:text-l n:leading-default">
  .n:leading-default - Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt amet ipsam enim sed sequi
  voluptatibus.
</p>
<p class="n:text-l n:leading-caption">
  .n:leading-caption - Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt amet ipsam enim sed sequi
  voluptatibus.
</p>

<hr class="n:divider" />

<!-- Text alignment -->
<p class="n:text-left">.n:text-left - Aligned to the left</p>
<p class="n:text-center">.n:text-center - Centered text</p>
<p class="n:text-right">.n:text-right - Aligned to the right</p>

<hr class="n:divider" />

<!-- Text transform -->
<p class="n:uppercase">.n:uppercase - the quick brown fox</p>
<p class="n:lowercase">.n:lowercase - THE QUICK BROWN FOX</p>
<p class="n:capitalize">.n:capitalize - the quick brown fox</p>

<hr class="n:divider" />

<!-- Text wrapping and overflow -->
<div class="n:max-w-xs n:truncate">.n:truncate - This text will be truncated with an ellipsis when it overflows</div>
<div class="n:max-w-xs n:break-words">.n:break-words - Thisisaverylongwordthatwillbreakwhenneeded</div>


<!-- Text colors -->
<p class="n:text-default">.n:text-default - Default text color</p>
<p class="n:text-weak">.n:text-weak - Weak text color</p>
<p class="n:text-weaker">.n:text-weaker - Weaker text color</p>
<p class="n:text-weakest">.n:text-weakest - Weakest text color</p>
<p class="n:text-link">.n:text-link - Link text color</p>
<p class="n:text-error">.n:text-error - Error text color</p>
<p class="n:text-danger">.n:text-danger - Danger text color</p>
<p class="n:text-success">.n:text-success - Success text color</p>
<p class="n:text-warning">.n:text-warning - Warning text color</p>
<p class="n:text-info">.n:text-info - Info text color</p>
<p class="n:text-highlight">.n:text-highlight - Highlight text color</p>
<p class="n:text-progress">.n:text-progress - Progress text color</p>

<hr class="n:divider" />

<!-- Background colors - surfaces -->
<div class="n:bg-surface n:p-m">.n:bg-surface</div>
<div class="n:bg-default n:p-m">.n:bg-default</div>
<div class="n:bg-surface-raised n:p-m">.n:bg-surface-raised</div>
<div class="n:bg-surface-lowered n:p-m">.n:bg-surface-lowered</div>

<hr class="n:divider" />

<!-- Background colors - status -->
<div class="n:bg-status-neutral n:p-m n:text-on-accent">.n:bg-status-neutral</div>
<div class="n:bg-status-warning n:p-m">.n:bg-status-warning</div>
<div class="n:bg-status-highlight n:p-m n:text-on-accent">.n:bg-status-highlight</div>
<div class="n:bg-status-danger n:p-m n:text-on-accent">.n:bg-status-danger</div>
<div class="n:bg-status-success n:p-m n:text-on-accent">.n:bg-status-success</div>
<div class="n:bg-status-info n:p-m n:text-on-accent">.n:bg-status-info</div>
<div class="n:bg-status-progress n:p-m n:text-on-accent">.n:bg-status-progress</div>

<hr class="n:divider" />

<!-- Background colors - status weak -->
<div class="n:bg-status-neutral-weak n:p-m">.n:bg-status-neutral-weak</div>
<div class="n:bg-status-warning-weak n:p-m">.n:bg-status-warning-weak</div>
<div class="n:bg-status-highlight-weak n:p-m">.n:bg-status-highlight-weak</div>
<div class="n:bg-status-danger-weak n:p-m">.n:bg-status-danger-weak</div>
<div class="n:bg-status-success-weak n:p-m">.n:bg-status-success-weak</div>
<div class="n:bg-status-info-weak n:p-m">.n:bg-status-info-weak</div>
<div class="n:bg-status-progress-weak n:p-m">.n:bg-status-progress-weak</div>

<hr class="n:divider" />

<!-- Border colors -->
<div class="n:border n:border-default n:p-m">.n:border-default</div>
<div class="n:border n:border-strong n:p-m">.n:border-strong</div>
<div class="n:border n:border-danger n:p-m">.n:border-danger</div>
<div class="n:border n:border-success n:p-m">.n:border-success</div>
<div class="n:border n:border-warning n:p-m">.n:border-warning</div>
<div class="n:border n:border-info n:p-m">.n:border-info</div>

<hr class="n:divider" />

<!-- Accent colors -->
<div class="n:bg-accent n:p-m n:text-on-accent">.n:bg-accent</div>
<div class="n:text-accent">.n:text-accent - Accent text color</div>
</template>
