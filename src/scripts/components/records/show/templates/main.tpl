<div class="info-message">
  <p>This record has been submitted and cannot be edited within this App.
    Go to the <a href="http://irecord.org.uk" target="_blank">iRecord website</a> to edit.</p>

</div>
<ul class="table-view core inputs info no-top">
  <li class="table-view-cell species">
    <% if (obj.common_name) { %>
      <span class="media-object pull-right descript"><%- obj.common_name %></span>
    <% } %>
    <span class="media-object pull-right descript"><i><%- obj.scientific_name %></i></span>
  </li>
  <li class="table-view-cell">
    <span class="media-object pull-left icon icon-location"></span>
    <span class="media-object pull-right descript"><%- obj.location_name %></span>
    <span class="media-object pull-right descript"><%- obj.location %></span>
    Location
  </li>
  <li class="table-view-cell">
    <span class="media-object pull-left icon icon-calendar"></span>
    <span class="media-object pull-right descript"><%- obj.date %></span>
    Date
  </li>
  <% if (obj.blackgrass) { %>
    <li class="table-view-cell">
      <span class="media-object pull-left icon icon-blackgrass"></span>
      <span class="media-object pull-right descript"><%- obj.blackgrass %></span>
      Blackgrass
    </li>
  <% } %>
  <% if (obj.season) { %>
    <li class="table-view-cell">
      <span class="media-object pull-left icon icon-season"></span>
      <span class="media-object pull-right descript"><%- obj.season %></span>
      season
    </li>
  <% } %>
  <% if (obj.comment) { %>
    <li class="table-view-cell">
      <span class="media-object pull-left icon icon-comment"></span>
      Comment
      <span class="comment descript"><%- obj.comment %></span>
    </li>
  <% } %>
  <% if (obj.images.length) { %>
    <li id="img-array">
      <% obj.images.each(function (image){ %>
        <img src="<%- image.getURL() %>" alt="">
      <% }) %>
    </li>
  <% } %>
</ul>

<div id="occurrence-id"><%- obj.id %></div>