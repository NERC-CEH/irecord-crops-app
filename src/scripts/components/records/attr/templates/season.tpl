<div class="info-message">
  <p>Please pick the crop sowing season.</p>
</div>

<div class="list">
  <label class="item item-radio">
    <input type="radio" name="group" value="default"  <%- !_.keys(obj).length || obj['default'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Not recorded
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="Spring" <%- obj['Spring'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Spring
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>

  <label class="item item-radio">
    <input type="radio" name="group" value="Winter" <%- obj['Winter'] ? 'checked' : ''%>>
    <div class="radio-content">
      <div class="item-content">
        Winter
      </div>
      <i class="radio-icon icon-check"></i>
    </div>
  </label>
</div>