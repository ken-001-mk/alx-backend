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
  
  def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict:
    data = []
    try:
      data = self.get_page(page, page_size)
    except AssertionError:
      return {}
    dataset: List = self.dataset()
    totalpages: int  = len(dataset) if dataset else 0
    totalpages = math.ceil(totalpages / page_size)
    lastviewedpage: int = (page + 1) if (page - 1) >= 1 else None
    nextviewedpage: int = (page + 1) if (page + 1) <= totalpages else None
    
    pagination: Dict = {
      'page_size': page_size,
      'page': page,
      'data': data,
      'next_page': nextviewedpage,
      'prev_page': lastviewedpage,
      'total_pages': totalpages
    }
    return pagination