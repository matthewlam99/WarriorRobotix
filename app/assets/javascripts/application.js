// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require turbolinks
//= require materialize-sprockets
//= require cocoon
//= require_tree .

Turbolinks.enableProgressBar();

$(function(){
  if (window.is_ios()) { window.ios_ready(); }
  window.hash_modal.refresh();

  $('.datepicker').pickadate({
   selectMonths: false,
   selectYears: false,
   format: 'dddd, mmmm d, yyyy'
  });

  $('select:not(.browser-default)').material_select();

  $('ul.tabs').tabs();

  replceNullDisableWith();

  $('.button-collapse').sideNav();

  $('.materialboxed').materialbox();

  $('.slider').slider({full_width: true, height: 500});

  $('.fixed-action-btn').openFAB();

  $('.countdown').countdown();
});

$(window).on('hashchange', function(){
  window.hash_modal.hashchange();
});

$(document).on('click', 'input[type=text][for]',function(){
  $(['input[id=\"',$(this).attr('for'),'\"]'].join('')).click();
});

$(document).on('click', '.stop-propagation', function(event){
  event.stopPropagation();
});

$(document).on('click', '.prevent-default', function(event){
  event.preventDefault();
});

$(document).on('click', 'input[data-trigger-form]', function(event){
  event.preventDefault();
  $t = $(this);
  if ($t.attr('type') == 'checkbox') {
    console.log($t.prop('checked') == true);
    $t.prop('checked',!$t.prop('checked'));
  } else {
    $t.prop('checked',true);
  }
  form = $(this.form);
  form.addClass('no-pointer-events');
  form.submit();
});

$(document).on('change', '.file-field input[type=\"file\"][data-photo-name-target]', function () {
  $t = $(this);
  var form = $t.closest('form');
  var target = form.find($t.data('photo-name-target'));
  if ($t[0].files !== undefined || $t[0].files[0] !== undefined) {
    var file = $t[0].files[0].name.replace(/\.[^/.]+$/, '');
    form.find(['label[for=\"',$t.data('photo-name-target').slice(1),'\"]'].join('')).addClass('active');
    target.attr('placeholder',file);
  }
});

$(document).on('click', '.lean-overlay', function(){
  location.hash = '#!';
});

function deletePoll(ele,event) {
  event.preventDefault();
  $t = $(ele);
  parent = $t.parent();
  if ($t.text() == 'Delete') {
    $t.text('Restore');
    parent.addClass('deleted-option')
    parent.children('input:hidden').first().value('1')
  } else {
    $t.text('Delete');
    parent.removeClass('deleted-option')
    parent.children('input:hidden').first().value('0')
  }
}

function replceNullDisableWith(){
  $('input[data-disable-with=\"null\"]').each(function(){
    var t = $(this);
    var v = t.val();
    t.data('disable-with',v)
    t.attr('data-disable-with',v);
  });
}
