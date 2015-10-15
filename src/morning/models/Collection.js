// Copyright 2012 Dmitry morning. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Collection of BaseModel classes.
 * Maintains event propagation from each model to collection.
 */
goog.provide('morning.models.Collection');
goog.provide('morning.models.Collection.ChangeEvent');
goog.provide('morning.models.Collection.MoveEvent');
goog.require('goog.array');
goog.require('goog.events');

/**
 * Collection of BaseModel classes.
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 * @template T
 */
morning.models.Collection = function()
{
  goog.base(this);

  /**
   * @type {Array.<T>}
   * @private
   */
  this.data_ = [];

  /**
   * @type {goog.events.EventHandler}
   * @private
   */
  this.handler_ = new goog.events.EventHandler(this);
};
goog.inherits(morning.models.Collection, goog.events.EventTarget);

/**
 * Whether the collection contains the given object.
 *
 * @param {*} obj The object for which to test.
 * @param {boolean=} opt_idCompare
 * @return {boolean} true if obj is present.
 */
morning.models.Collection.prototype.contains = function(obj, opt_idCompare)
{
  if (opt_idCompare)
  {
    return !!this.getById(obj.id);
  }
  else
  {
    return goog.array.contains(this.data_, obj);
  }
};

/**
 * Returns number of elements in collection.
 *
 * @return {number}
 */
morning.models.Collection.prototype.count = function()
{
  return this.data_.length;
};

/**
 * Calls a function for each element in an array.
 *
 * @param {Function} f The function to call for every element. This function
 *   takes 3 arguments (the element, the index and the array). The return
 *   value is ignored. The function is called only for indexes of the array
 *   which have assigned values; it is not called for indexes which have
 *   been deleted or which have never been assigned values.
 *
 * @param {Object=} opt_obj The object to be used as the value of 'this'
 *   within f.
 */
morning.models.Collection.prototype.forEach = function(f, opt_obj)
{
  goog.array.forEach(this.data_, f, opt_obj);
};

/**
 * Iterates through elements in collection backwards.
 * @param {Function} f The function to call for every element. This function
 *   takes 3 arguments (the element, the index and the array). The return
 *   value is ignored. The function is called only for indexes of the array
 *   which have assigned values; it is not called for indexes which have
 *   been deleted or which have never been assigned values.
 *
 * @param {Object=} opt_obj The object to be used as the value of 'this'
 *   within f.
 */
morning.models.Collection.prototype.forEachRight = function(f, opt_obj)
{
  goog.array.forEachRight(this.data_, f, opt_obj);
};

/**
 * @param {number} index
 * @return {*}
 */
morning.models.Collection.prototype.getAt = function(index)
{
  return this.data_[index];
};

/**
 * Returns model with specified ID.
 *
 * @param {number} id
 * @return {*}
 */
morning.models.Collection.prototype.getById = function(id)
{
  var found = null;
  goog.array.forEach(this.data_, function(item) {
    if (item.id == id)
    {
      found = item;
    }
  });

  return found;
};

/**
 * Pushes an item into an array, if it's not already in the array.
 *
 * @param {T} item Value to add.
 */
morning.models.Collection.prototype.insert = function(item)
{
  item.setParentEventTarget(this);
  goog.array.insert(this.data_, item);

  this.dispatchEvent({
    type: morning.models.Collection.EventType.INSERT,
    item: item,
    index: this.data_.length - 1
  });
};

/**
 * Inserts an object at the given index of the array.
 *
 * @param {T} item The object to insert.
 * @param {number=} index The index at which to insert the object. If omitted,
 *    treated as 0. A negative index is counted from the end of the array.
 */
morning.models.Collection.prototype.insertAt = function(item, index)
{
  item.setParentEventTarget(this);
  goog.array.insertAt(this.data_, item, index);

  this.dispatchEvent({
    type: morning.models.Collection.EventType.INSERT,
    item: item,
    index: index
  });
};

/**
 * Returns index of specified model in collection. Returns -1 if element not found.
 *
 * @param {T} item
 * @return {number}
 */
morning.models.Collection.prototype.indexOf = function(item)
{
  return goog.array.indexOf(this.data_, item);
};

/**
 * @param {number} oldIndex
 * @param {number} newIndex
 */
morning.models.Collection.prototype.move = function(oldIndex, newIndex)
{
  if (oldIndex == newIndex)
  {
    return;
  }

  var item = this.data_[oldIndex];

  goog.array.removeAt(this.data_, oldIndex);
  goog.array.insertAt(this.data_, item, newIndex);

  this.dispatchEvent({
    type: morning.models.Collection.EventType.MOVE,
    oldIndex: oldIndex,
    newIndex: newIndex
  });
};

/**
 * Removes the first occurrence of a particular value from an array.
 * @param {T} item Object to remove.
 * @return {boolean} True if an element was removed.
 */
morning.models.Collection.prototype.remove = function(item)
{
  var index = this.indexOf(item);
  return this.removeAt(index);
};

/**
 * Removes from an array the element at index i
 * @param {number} index The index to remove.
 * @return {boolean} True if an element was removed.
 */
morning.models.Collection.prototype.removeAt = function(index)
{

  var item = this.data_[index],
    removed = goog.array.remove(this.data_, item);

  if (removed)
  {
    item.setParentEventTarget(null);
    this.dispatchEvent({
      type: morning.models.Collection.EventType.REMOVE,
      index: index,
      item: item
    });
  }

  return removed;
};

/**
 * Serializes collection
 *
 * @return Array.<Object>
 */
morning.models.Collection.prototype.serialize = function()
{
   var data = [];
   goog.array.forEach(this.data_, function(item) {
     data.push(item.serialize());
   });
   return data;
};

/**
 * Calls f for each element of an array. If any call returns true, some()
 * returns true (without checking the remaining elements). If all calls
 * return false, some() returns false.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-some}
 *
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a boolean.
 * @param {S=} opt_obj  The object to be used as the value of 'this'
 *     within f.
 * @return {boolean} true if any element passes the test.
 * @template T,S
 */
morning.models.Collection.prototype.some = function(f, opt_obj)
{
  return goog.array.some(this.data_, f, opt_obj);
};

/**
 * Sorts an array by specified sorter function.
 *
 * @param  {function(?,?)} fn
 */
morning.models.Collection.prototype.sort = function(fn)
{
  this.data_.sort(fn);
};

/**
 * Converts data to an array.
 *
 * @return {T}
 */
morning.models.Collection.prototype.toArray = function()
{
  var data = [];
  for (var i = 0; i < this.data_.length; i++)
  {
    data.push(this.data_[i]);
  }
  return data;
};

/**
 * Events associated with collection
 * @enum {string}
 */
morning.models.Collection.EventType = {
  INSERT: 'insert',
  CHANGE: goog.events.EventType.CHANGE,
  MOVE: 'move',
  REMOVE: 'remove'
};

/**
 * @constructor
 * @param {string} type Event Type.
 * @param {T=} opt_target Reference to the object that is the target of
 *   this event. It has to implement the {@code EventTarget} interface
 *   declared at {@link http://developer.mozilla.org/en/DOM/EventTarget}.
 * @extends {goog.events.Event}
 * @template T
 */
morning.models.Collection.ChangeEvent = function(type, opt_target)
{
  goog.base(this, type, opt_target);

  /**
   * @type {T}
   */
  this.item = null;

  /**
   * @type {number}
   */
  this.index = 0;
};
goog.inherits(morning.models.Collection.ChangeEvent, goog.events.Event);

/**
 * @constructor
 * @param {string} type Event Type.
 * @param {T=} opt_target Reference to the object that is the target of
 *   this event. It has to implement the {@code EventTarget} interface
 *   declared at {@link http://developer.mozilla.org/en/DOM/EventTarget}.
 * @extends {goog.events.Event}
 * @template T
 */
morning.models.Collection.MoveEvent = function(type, opt_target)
{
  goog.base(this, type, opt_target);

  /**
   * @type {number}
   */
  this.oldIndex = 0;

  /**
   * @type {number}
   */
  this.newIndex = 0;
};
goog.inherits(morning.models.Collection.MoveEvent, goog.events.Event);
