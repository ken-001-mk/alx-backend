#!/usr/bin/env python3
"""MRU caching system module"""

from collections import OrderedDict
from base_caching import BaseCaching

class MRUCache(BaseCaching):
  """MRU caching system class"""

  def __init__(self):
    """Constructor"""
    super().__init__()
    self.cache_data = OrderedDict()

  def put(self, key, item):
    """Add an item in the cache"""
    if key and item:
      self.cache_data[key] = item
      if len(self.cache_data) > BaseCaching.MAX_ITEMS:
        last = next(reversed(self.cache_data))
        self.cache_data.pop(last)
        print('DISCARD: {}'.format(last))

  def get(self, key):
    """Get an item by key"""
    if key in self.cache_data:
      self.cache_data.move_to_end(key)
      return self.cache_data[key]
    return None