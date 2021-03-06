// This file was autogenerated by closure-library/closure/bin/build/depswriter.py.
// Please do not edit.
goog.addDependency('../../../moninjs/src/monin/app/ModularApp.js', ['morning.app.ModularApp'], ['goog.dom.classlist', 'goog.events.EventTarget', 'goog.module.ModuleLoader', 'goog.module.ModuleManager'], false);
goog.addDependency('../../../moninjs/src/monin/canvas/BoundingBox.js', ['morning.canvas.BoundingBox'], ['goog.math.Rect'], false);
goog.addDependency('../../../moninjs/src/monin/canvas/CanvasBoxWithShapes.js', ['morning.canvas.CanvasBoxWithShape'], [], false);
goog.addDependency('../../../moninjs/src/monin/canvas/PathParser.js', ['morning.canvas.PathParser'], ['goog.string'], false);
goog.addDependency('../../../moninjs/src/monin/canvas/SvgPathRenderer.js', ['morning.canvas.SvgPathRenderer'], ['goog.math.Coordinate', 'morning.canvas.BoundingBox', 'morning.canvas.PathParser'], false);
goog.addDependency('../../../moninjs/src/monin/controllers/BaseController.js', ['morning.controllers.BaseController'], ['goog.events.EventHandler', 'goog.events.EventTarget'], false);
goog.addDependency('../../../moninjs/src/monin/controllers/ComponentController.js', ['morning.controllers.ComponentController'], ['goog.dom.dataset', 'goog.structs.Map', 'goog.ui.decorate', 'morning.controllers.BaseController'], false);
goog.addDependency('../../../moninjs/src/monin/controllers/ContentController.js', ['morning.controllers.ContentController'], ['goog.fx.easing', 'goog.module.ModuleManager', 'morning.controllers.BaseController', 'morning.controllers.ComponentController', 'morning.fx.WindowScroll'], false);
goog.addDependency('../../../moninjs/src/monin/crypt/Aes.js', ['morning.crypt.Aes'], ['morning.crypt.blockmodes', 'morning.crypt.core', 'morning.crypt.hmac', 'morning.crypt.pbkdf2', 'morning.crypt.sha1'], false);
goog.addDependency('../../../moninjs/src/monin/crypt/blockmodes.js', ['morning.crypt.blockmodes', 'morning.crypt.blockmodes.Mode', 'morning.crypt.blockmodes.OfbMode', 'morning.crypt.blockmodes.pad.ansix923', 'morning.crypt.blockmodes.pad.iso10126', 'morning.crypt.blockmodes.pad.iso7816', 'morning.crypt.blockmodes.pad.noPadding', 'morning.crypt.blockmodes.pad.pkcs7', 'morning.crypt.blockmodes.pad.zeroPadding'], [], false);
goog.addDependency('../../../moninjs/src/monin/crypt/core.js', ['morning.crypt.Encoder', 'morning.crypt.EncodingOptions', 'morning.crypt.charenc', 'morning.crypt.charenc.UTF8', 'morning.crypt.charenc.binary', 'morning.crypt.core', 'morning.crypt.util'], [], false);
goog.addDependency('../../../moninjs/src/monin/crypt/hmac.js', ['morning.crypt.hmac'], ['morning.crypt.sha1'], false);
goog.addDependency('../../../moninjs/src/monin/crypt/pbkdf2.js', ['morning.crypt.pbkdf2'], [], false);
goog.addDependency('../../../moninjs/src/monin/crypt/sha1.js', ['morning.crypt.sha1'], [], false);
goog.addDependency('../../../moninjs/src/monin/events/TapProvider.js', ['morning.events.TapProvider'], ['goog.async.Delay', 'goog.dom.classlist', 'goog.events.EventHandler', 'goog.events.EventTarget', 'morning.events', 'morning.mobile'], false);
goog.addDependency('../../../moninjs/src/monin/events/events.js', ['morning.events'], [], false);
goog.addDependency('../../../moninjs/src/monin/forms/AbstractControl.js', ['morning.forms.AbstractControl'], ['goog.dom.classlist', 'goog.ui.Component', 'morning.forms.IControl'], false);
goog.addDependency('../../../moninjs/src/monin/forms/CharacterLimiter.js', ['morning.forms.CharacterLimiter'], ['goog.dom.dataset', 'goog.events.KeyCodes', 'goog.ui.Component'], false);
goog.addDependency('../../../moninjs/src/monin/forms/Checkbox.js', ['morning.forms.Checkbox'], ['goog.dom.dataset', 'goog.ui.Checkbox', 'morning.forms.IControl'], false);
goog.addDependency('../../../moninjs/src/monin/forms/ControlFactory.js', ['morning.forms.ControlFactory'], ['morning.forms.Checkbox', 'morning.forms.Textarea', 'morning.forms.Textbox'], false);
goog.addDependency('../../../moninjs/src/monin/forms/DefaultErrorProvider.js', ['morning.forms.DefaultErrorProvider'], ['goog.Timer', 'goog.dom', 'goog.dom.classlist', 'goog.ui.Component', 'morning.forms.IErrorProvider', 'morning.forms.Textbox'], false);
goog.addDependency('../../../moninjs/src/monin/forms/Form.js', ['morning.forms.Form'], ['goog.structs.Map', 'goog.ui.Component', 'goog.ui.registry', 'morning.forms.FormItem', 'morning.validation.FormValidation'], false);
goog.addDependency('../../../moninjs/src/monin/forms/FormItem.js', ['morning.forms.FormItem'], ['goog.ui.Component', 'goog.ui.registry'], false);
goog.addDependency('../../../moninjs/src/monin/forms/Hidden.js', ['morning.forms.Hidden'], ['goog.ui.Component', 'goog.ui.registry'], false);
goog.addDependency('../../../moninjs/src/monin/forms/IControl.js', ['morning.forms.IControl'], [], false);
goog.addDependency('../../../moninjs/src/monin/forms/IErrorProvider.js', ['morning.forms.IErrorProvider'], [], false);
goog.addDependency('../../../moninjs/src/monin/forms/Select.js', ['morning.forms.Select'], ['goog.dom.dataset', 'goog.ui.Option', 'goog.ui.Select'], false);
goog.addDependency('../../../moninjs/src/monin/forms/SwitchControl.js', ['morning.forms.SwitchControl'], ['goog.dom.dataset', 'goog.ui.registry', 'morning.forms.AbstractControl', 'morning.forms.IControl'], false);
goog.addDependency('../../../moninjs/src/monin/forms/Textarea.js', ['morning.forms.Textarea'], ['goog.ui.Control', 'goog.ui.Textarea', 'goog.ui.registry', 'morning.forms.IControl'], false);
goog.addDependency('../../../moninjs/src/monin/forms/Textbox.js', ['morning.forms.Textbox'], ['goog.async.Delay', 'goog.events.KeyCodes', 'goog.ui.Control', 'goog.ui.registry', 'morning.forms.IControl', 'morning.forms.TextboxRenderer'], false);
goog.addDependency('../../../moninjs/src/monin/forms/TextboxPlaceholderHandler.js', ['morning.forms.TextboxPlaceholderHandler'], ['goog.events.EventHandler'], false);
goog.addDependency('../../../moninjs/src/monin/forms/TextboxRenderer.js', ['morning.forms.TextboxRenderer'], ['goog.ui.ControlRenderer'], false);
goog.addDependency('../../../moninjs/src/monin/forms/TooltipErrorProvider.js', ['morning.forms.TooltipErrorProvider'], ['goog.fx.easing', 'morning.forms.IErrorProvider', 'morning.fx.WindowScroll'], false);
goog.addDependency('../../../moninjs/src/monin/fx/Animation.js', ['morning.fx.Animation'], ['goog.fx.Animation'], false);
goog.addDependency('../../../moninjs/src/monin/fx/WindowScroll.js', ['morning.fx.WindowScroll'], ['morning.fx.dom.PredefinedEffect'], false);
goog.addDependency('../../../moninjs/src/monin/fx/dom.js', ['morning.fx.dom.PredefinedEffect', 'morning.fx.dom.Slide', 'morning.fx.dom.SlideFrom'], ['goog.style.bidi', 'morning.fx.Animation'], false);
goog.addDependency('../../../moninjs/src/monin/fx/easing.js', ['morning.fx.easing'], [], false);
goog.addDependency('../../../moninjs/src/monin/measure/AbstractMeasure.js', ['morning.measure.AbstractMeasure'], [], false);
goog.addDependency('../../../moninjs/src/monin/measure/Length.js', ['morning.measure.Length'], ['morning.measure.AbstractMeasure'], false);
goog.addDependency('../../../moninjs/src/monin/measure/Temperature.js', ['morning.measure.Temperature'], ['morning.measure.AbstractMeasure'], false);
goog.addDependency('../../../moninjs/src/monin/mobile/ViewportScale.js', ['morning.mobile.ViewportScale'], ['goog.dom', 'goog.math.Size', 'goog.style', 'morning.mobile'], false);
goog.addDependency('../../../moninjs/src/monin/mobile/mobile.js', ['morning.mobile'], ['goog.events.BrowserFeature', 'goog.math.Size', 'goog.math.Vec2'], false);
goog.addDependency('../../../moninjs/src/monin/models/BaseModel.js', ['morning.models.BaseModel'], ['goog.events.EventTarget'], false);
goog.addDependency('../../../moninjs/src/monin/models/Collection.js', ['morning.models.Collection', 'morning.models.Collection.ChangeEvent', 'morning.models.Collection.MoveEvent'], ['goog.array', 'goog.events'], false);
goog.addDependency('../../../moninjs/src/monin/models/Image.js', ['morning.models.Image'], ['goog.events.EventTarget', 'goog.math.Size', 'goog.net.ImageLoader'], false);
goog.addDependency('../../../moninjs/src/monin/net/EncryptedXhr.js', ['morning.net.EncryptedXhr'], ['goog.json', 'goog.net.XhrIo', 'morning.crypt.Aes'], false);
goog.addDependency('../../../moninjs/src/monin/net/ExternalApi.js', ['morning.net.ExternalApi'], ['goog.async.ConditionalDelay'], false);
goog.addDependency('../../../moninjs/src/monin/net/Navigator.js', ['morning.net.Navigator'], ['goog.Timer', 'goog.async.ConditionalDelay', 'goog.dom.iframe', 'goog.events.EventTarget', 'goog.net.XhrIo'], false);
goog.addDependency('../../../moninjs/src/monin/net/Socket.js', ['morning.net.Socket'], ['goog.events.EventTarget', 'morning.net.ExternalApi'], false);
goog.addDependency('../../../moninjs/src/monin/net/SocketHandler.js', ['morning.net.SocketHandler'], ['goog.Disposable'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/AbstractScrollStrategy.js', ['morning.parallax.AbstractScrollStrategy'], ['goog.events.EventTarget'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/CustomScrollStrategy.js', ['morning.parallax.CustomScrollStrategy'], ['goog.events.EventTarget', 'goog.events.MouseWheelHandler', 'morning.parallax.AbstractScrollStrategy', 'morning.parallax.registry'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/ScrollToElementStrategy.js', ['morning.parallax.ScrollToElementStrategy'], ['goog.dom', 'goog.events.EventTarget', 'morning.parallax.AbstractScrollStrategy', 'morning.parallax.registry'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/StrategyFactory.js', ['morning.parallax.registry'], [], false);
goog.addDependency('../../../moninjs/src/monin/parallax/WindowScrollStrategy.js', ['morning.parallax.WindowScrollStrategy'], ['goog.dom', 'goog.events.EventTarget', 'morning.parallax.AbstractScrollStrategy', 'morning.parallax.registry'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/effects/AbstractPropertyEffect.js', ['morning.parallax.effects.AbstractPropertyEffect'], ['morning.parallax.effects.Effect'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/effects/CounterEffect.js', ['morning.parallax.effects.CounterEffect'], ['goog.dom.dataset', 'morning.parallax.effects.Effect'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/effects/Effect.js', ['morning.parallax.effects.Effect'], ['goog.fx.easing', 'goog.math.Range', 'morning.fx.easing'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/effects/EffectFactory.js', ['morning.parallax.effects.EffectFactory'], ['morning.parallax.effects.CounterEffect', 'morning.parallax.effects.ParallaxEffect', 'morning.parallax.effects.StyleEffect'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/effects/ParallaxEffect.js', ['morning.parallax.effects.ParallaxEffect'], ['morning.parallax.effects.Effect', 'morning.style'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/effects/StyleEffect.js', ['morning.parallax.effects.StyleEffect'], ['goog.structs.Map', 'morning.parallax.effects.AbstractPropertyEffect'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/model/ElementConfig.js', ['morning.parallax.models.ElementConfig'], ['morning.models.BaseModel'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/model/SceneConfig.js', ['morning.parallax.model.SceneConfig'], [], false);
goog.addDependency('../../../moninjs/src/monin/parallax/ui/Element.js', ['morning.parallax.ui.Element'], ['goog.math.Coordinate', 'goog.math.Range', 'goog.style', 'goog.ui.Component', 'goog.ui.registry', 'morning.parallax.models.ElementConfig'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/ui/ImageElement.js', ['morning.parallax.ui.ImageElement'], ['goog.net.ImageLoader', 'goog.style', 'goog.ui.registry', 'goog.uri.utils', 'morning.parallax.ui.Element'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/ui/ParallaxContainer.js', ['morning.parallax.ui.ParallaxContainer'], ['goog.dom.dataset', 'goog.events.KeyCodes', 'goog.fx.anim', 'goog.net.XhrIo', 'goog.structs.Map', 'goog.ui.Component', 'morning.events', 'morning.parallax.effects.EffectFactory', 'morning.parallax.registry', 'morning.parallax.ui.Element', 'morning.parallax.ui.Scene'], false);
goog.addDependency('../../../moninjs/src/monin/parallax/ui/Scene.js', ['morning.parallax.ui.Scene'], ['goog.dom.classlist', 'goog.fx.Animation', 'goog.fx.easing', 'goog.ui.Component', 'goog.ui.registry', 'morning.parallax.model.SceneConfig'], false);
goog.addDependency('../../../moninjs/src/monin/routing/RegexRoute.js', ['morning.routing.RegexRoute'], ['morning.routing.Route', 'morning.routing.RouteMatchEvent'], false);
goog.addDependency('../../../moninjs/src/monin/routing/Route.js', ['morning.routing.Route', 'morning.routing.Route.EventType'], ['goog.events.EventTarget'], false);
goog.addDependency('../../../moninjs/src/monin/routing/RouteMatchEvent.js', ['morning.routing.RouteMatchEvent'], ['goog.events.Event'], false);
goog.addDependency('../../../moninjs/src/monin/routing/Router.js', ['morning.routing.Router'], ['goog.events.EventTarget'], false);
goog.addDependency('../../../moninjs/src/monin/social/VimeoService.js', ['morning.social.VimeoService'], ['goog.net.Jsonp'], false);
goog.addDependency('../../../moninjs/src/monin/social/YouTubeService.js', ['morning.social.YouTubeService'], ['goog.net.Jsonp'], false);
goog.addDependency('../../../moninjs/src/monin/storage/AppData.js', ['morning.storage.AppData'], ['goog.storage.ExpiringStorage', 'goog.storage.mechanism.mechanismfactory'], false);
goog.addDependency('../../../moninjs/src/monin/style/style.js', ['morning.style'], ['goog.style'], false);
goog.addDependency('../../../moninjs/src/monin/ui/ArrowButtonRenderer.js', ['morning.ui.ArrowButtonRenderer'], ['goog.dom', 'goog.dom.TagName', 'goog.dom.classlist', 'goog.ui.Button', 'goog.ui.ButtonRenderer', 'goog.ui.ControlContent', 'goog.ui.INLINE_BLOCK_CLASSNAME'], false);
goog.addDependency('../../../moninjs/src/monin/ui/ArrowNavigation.js', ['morning.ui.ArrowNavigation', 'morning.ui.ArrowNavigationEvent'], ['goog.dom.classlist', 'goog.ui.Component', 'goog.ui.registry', 'morning.events.TapProvider'], false);
goog.addDependency('../../../moninjs/src/monin/ui/Button.js', ['morning.ui.Button'], ['goog.dom.dataset', 'goog.style', 'goog.ui.Component', 'goog.ui.Component.EventType', 'goog.ui.registry', 'morning.events.TapProvider'], false);
goog.addDependency('../../../moninjs/src/monin/ui/Countdown.js', ['morning.ui.CountDown'], ['goog.Timer', 'goog.dom.dataset', 'goog.string', 'goog.ui.Component', 'goog.ui.registry'], false);
goog.addDependency('../../../moninjs/src/monin/ui/CoverBackground.js', ['morning.ui.CoverBackground'], ['goog.math.Size', 'goog.ui.Component', 'morning.models.Image'], false);
goog.addDependency('../../../moninjs/src/monin/ui/DatePicker.js', ['morning.ui.DatePicker', 'morning.ui.DatePicker.SelectionMode', 'morning.ui.DatePickerEvent'], ['goog.date', 'goog.date.Date', 'goog.date.DateRange', 'goog.date.Interval', 'goog.dom', 'goog.dom.classlist', 'goog.i18n.DateTimeFormat', 'goog.i18n.DateTimeSymbols', 'goog.ui.Component', 'goog.ui.registry'], false);
goog.addDependency('../../../moninjs/src/monin/ui/DraggableGallery.js', ['morning.ui.DraggableGallery'], ['goog.fx.anim', 'goog.fx.anim.Animated', 'goog.math.Coordinate', 'goog.ui.Component', 'morning.events'], false);
goog.addDependency('../../../moninjs/src/monin/ui/DraggableGalleryItem.js', ['morning.ui.DraggableGalleryItem', 'morning.ui.IDraggableItemPhotoRenderer'], ['goog.style'], false);
goog.addDependency('../../../moninjs/src/monin/ui/DraggableItemPhotoRenderer.js', ['morning.ui.DraggableItemPhotoRenderer'], ['goog.style', 'morning.ui.IDraggableItemPhotoRenderer'], false);
goog.addDependency('../../../moninjs/src/monin/ui/FileUploader.js', ['morning.ui.FileUploader', 'morning.ui.FileUploader.EventType', 'morning.ui.FileUploader.File'], ['goog.json', 'goog.ui.Component'], false);
goog.addDependency('../../../moninjs/src/monin/ui/FileUploaderFactory.js', ['morning.ui.FileUploaderFactory'], ['goog.userAgent', 'morning.ui.FileUploaderHtml4', 'morning.ui.FileUploaderHtml5'], false);
goog.addDependency('../../../moninjs/src/monin/ui/FileUploaderHtml4.js', ['morning.ui.FileUploaderHtml4'], ['goog.Uri', 'goog.dom.classlist', 'goog.json', 'goog.structs.Map', 'goog.style', 'goog.ui.Component', 'goog.ui.media.FlashObject', 'morning.ui.FileUploader', 'morning.ui.FileUploader.EventType'], false);
goog.addDependency('../../../moninjs/src/monin/ui/FileUploaderHtml5.js', ['morning.ui.FileUploaderHtml5'], ['goog.events.FileDropHandler', 'goog.json', 'goog.ui.Component', 'morning.ui.FileUploader'], false);
goog.addDependency('../../../moninjs/src/monin/ui/HamburgerButton.js', ['morning.ui.HamburgerButton'], ['goog.dom.classlist', 'goog.ui.Component', 'goog.ui.registry'], false);
goog.addDependency('../../../moninjs/src/monin/ui/HoverEffect.js', ['morning.ui.HoverEffect'], ['goog.dom.classlist', 'goog.events.EventHandler', 'goog.events.EventTarget', 'morning.events', 'morning.mobile'], false);
goog.addDependency('../../../moninjs/src/monin/ui/Keyboard.js', ['morning.ui.Keyboard'], ['goog.dom.classlist', 'goog.dom.dataset', 'goog.structs.Map', 'goog.ui.Component'], false);
goog.addDependency('../../../moninjs/src/monin/ui/Loader.js', ['morning.ui.Loader'], ['goog.ui.Component', 'morning.net.ExternalApi'], false);
goog.addDependency('../../../moninjs/src/monin/ui/NumberRenderer.js', ['morning.ui.NumberRenderer'], ['goog.fx.easing', 'goog.i18n.NumberFormat', 'goog.ui.Component', 'morning.fx.Animation'], false);
goog.addDependency('../../../moninjs/src/monin/ui/Overlay.js', ['morning.ui.Overlay'], ['goog.ui.Component'], false);
goog.addDependency('../../../moninjs/src/monin/ui/Swiffy.js', ['morning.ui.Swiffy'], ['goog.Timer', 'goog.dom.dataset', 'goog.fx.Animation', 'goog.fx.Transition', 'goog.net.XhrIo', 'morning.net.ExternalApi'], false);
goog.addDependency('../../../moninjs/src/monin/ui/Swiper.js', ['morning.ui.Swiper'], ['goog.Timer', 'goog.dom.dataset', 'goog.ui.Component', 'goog.ui.registry', 'morning.net.ExternalApi'], false);
goog.addDependency('../../../moninjs/src/monin/ui/ToggleButton.js', ['morning.ui.ToggleButton'], ['goog.dom.classlist', 'goog.ui.registry', 'morning.ui.Button'], false);
goog.addDependency('../../../moninjs/src/monin/ui/Tooltip.js', ['morning.ui.Tooltip', 'morning.ui.Tooltip.Direction'], ['goog.array', 'goog.dom.classlist', 'goog.fx.easing', 'goog.math.Coordinate', 'goog.style', 'goog.ui.Component', 'morning.fx.dom.Slide'], false);
goog.addDependency('../../../moninjs/src/monin/ui/TooltipAction.js', ['morning.ui.TooltipAction'], ['goog.ui.Component'], false);
goog.addDependency('../../../moninjs/src/monin/ui/UnitConverter.js', ['morning.ui.UnitConverter'], ['goog.dom.classlist', 'goog.dom.dataset', 'goog.string', 'goog.ui.Component', 'goog.ui.Tooltip', 'morning.measure.Length', 'morning.measure.Temperature'], false);
goog.addDependency('../../../moninjs/src/monin/validation/EmailValidator.js', ['morning.validation.EmailValidator'], ['goog.format.EmailAddress', 'morning.validation.Validator'], false);
goog.addDependency('../../../moninjs/src/monin/validation/EqualityValidator.js', ['morning.validation.EqualityValidator'], ['morning.validation.Validator'], false);
goog.addDependency('../../../moninjs/src/monin/validation/FormValidation.js', ['morning.validation.FormValidation', 'morning.validation.FormValidationError'], ['goog.events.EventHandler', 'goog.events.EventTarget', 'morning.validation.FormValidationResult', 'morning.validation.Validator'], false);
goog.addDependency('../../../moninjs/src/monin/validation/FormValidationResult.js', ['morning.validation.FormValidationResult'], [], false);
goog.addDependency('../../../moninjs/src/monin/validation/RegexValidator.js', ['morning.validation.RegexValidator'], ['morning.validation.Validator'], false);
goog.addDependency('../../../moninjs/src/monin/validation/RequiredFieldValidator.js', ['morning.validation.RequiredFieldValidator'], ['morning.validation.Validator'], false);
goog.addDependency('../../../moninjs/src/monin/validation/Validator.js', ['morning.validation.Validator', 'morning.validation.Validator.EventType'], [], false);
goog.addDependency('../../../moninjs/src/monin/validation/ZipcodeValidator.js', ['morning.validation.ZipcodeValidator'], ['morning.validation.Validator'], false);
