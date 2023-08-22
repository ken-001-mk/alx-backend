#!/usr/bin/env python3
"""LFU caching system module"""

from collections import OrderedDict
from base_caching import BaseCaching

class LFUCache(BaseCaching):
  """LFU caching system class"""

  def __init__(self):
    """Constructor"""
    super().__init__()
    self.cache_data = OrderedDict()

  def put(self, key, item):
    """Add an item in the cache"""
    if key and item:
      self.cache_data[key] = item
      if len(self.cache_data) > BaseCaching.MAX_ITEMS:
        first = next(iter(self.cache_data))
        self.cache_data.pop(first)
        print('DISCARD: {}'.format(first))

  def get(self, key):
    """Get an item by key"""
    if key in self.cache_data:
      self.cache_data.move_to_end(key)
      return self.cache_data[key]
    return None