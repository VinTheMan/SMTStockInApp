<template>
  <div class="container d-flex flex-column">
    <div class="row vh-100">
      <div class="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
        <div class="d-table-cell align-middle">
          <div class="text-center">
            <h1 class="display-1 font-weight-bold">404</h1>
            <p class="h1">Page not found.</p>
            <p class="h2 font-weight-normal mt-3 mb-4">
              The page you are looking for might have been removed.
            </p>
            <router-link class="btn btn-primary btn-lg" to="/"
              >Return to website</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="notyf"></div>
  <div
    class="notyf-announcer"
    aria-atomic="true"
    aria-live="polite"
    style="
      border: 0px none;
      clip: rect(0px, 0px, 0px, 0px);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0px;
      position: absolute;
      width: 1px;
      outline: currentcolor none 0px;
    "
  ></div>
</template>
