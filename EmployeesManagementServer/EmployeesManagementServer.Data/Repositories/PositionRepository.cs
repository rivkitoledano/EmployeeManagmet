﻿using EmployeesManagementServer.Core.Models;
using EmployeesManagementServer.Core.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeesManagementServer.Data.Repositories
{
    public class PositionRepository:IPositionRepository
    {
        private readonly DataContext _context;
        public PositionRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Position> AddEmployeeAsync(Position position)
        {
            _context.Positions.AddAsync(position);
            await _context.SaveChangesAsync();
            return position;
        }

        //public async Task<bool> DeletePositionAsync(int id)
        //{
        //    var position = await _context.Positions.FirstOrDefaultAsync(p => p.PositionId == id);

        //    if (position != null)
        //    {
        //        position.StatusDelete = false;
        //        await _context.SaveChangesAsync();
        //        return true; 
        //    }
        //    return false; 
        //}

        public async Task<IEnumerable<Position>> GetPositionsAsync()
        {
            return await _context.Positions.ToListAsync();
        }

        
    }
}
