#!/usr/bin/env python3

import csv
import math
from typing import Tuple, List, Dict

def index_range(page: int, page_size: int) -> Tuple[int, int]:
  """return a tuple of size two containing a start index and an end index
  """
  start_index = (page - 1) * page_size
  end_index = page * page_size
  return (start_index, end_index)

class Server:
  """Server class to paginate a database of popular baby names.
  """
  DATA_FILE = "Popular_Baby_Names.csv"

  def __init__(self):
    self.__dataset = None

  def dataset(self) -> List[List]:
    """Cached dataset
    """
    if self.__dataset is None:
      with open(self.DATA_FILE) as f:
        reader = csv.reader(f)
        dataset = [row for row in reader]
      self.__dataset = dataset[1:]

      return self.__dataset

  def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
    """return the appropriate page of the dataset"""
    assert isinstance(page, int) and page > 0
    assert isinstance(page_size, int) and page_size > 0
    range: Tuple = index_range(page, page_size)
    pagination: List = self.dataset()
    return (pagination[range[0]:range[1]])
  
  def get_hyper(self, page: int = 1, page_size: int = 10) -> dict:
    if not isinstance(page, int) or not isinstance(page_size, int) or page <= 0 or page_size <= 0:
      return {}

    total_pages = math.ceil(len(self.dataset()) / page_size)
    data_page = self.get_page(page, page_size)
    
    hyper_dict = {
      "page_size": len(data_page),
      "page": page,
      "data": data_page,
      "next_page": page + 1 if page < total_pages else None,
      "prev_page": page - 1 if page > 1 else None,
      "total_pages": total_pages
    }
    
    return hyper_dict
