<div class="info-message">
  <p>Select the score of Blackgrass infestation.</p>
</div>
<div class="list">
  <label class="item item-radio">
    <input type="radio" name="group" value="default"
    <%- !_.keys(obj).length || obj['default'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        None
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="1" <%- obj['1'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        1
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="2" <%- obj['2'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        2
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="3" <%- obj['3'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        3
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="4" <%- obj['4'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        4
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="5" <%- obj['5'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        5
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>
</div>

<!--<ul class="list">-->

  <!--<li class="item item-checkbox">-->
    <!--<label class="checkbox">-->
      <!--<input type="checkbox">-->
    <!--</label>-->
    <!--Flux Capacitor-->
  <!--</li>-->

  <!--<li class="item item-checkbox">-->
  <!--<label class="checkbox">-->
    <!--<input type="checkbox">-->
  <!--</label>-->
  <!--Flux Capacitor-->
<!--</li>-->
<!--</ul>-->