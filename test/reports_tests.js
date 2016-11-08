var should    = require("chai").should(),
	expect    = require("chai").expect,
	supertest = require("supertest"),
	api       = supertest("http://localhost:3000")


describe('reports', function() {
  it('should add a SINGLE report on /reports POST', function(done) {
  api.post("/reports")
    .send({'gross_rent': 1000, 'address': '1449 Lake Shore Ave, Los Angeles, CA 90026', 'email':'joe@gmail.com', 'agent':'david', 'phone':6128893535})
    .end(function(err, res){
      expect(res.status).to.equal(200);
      expect(res.type).to.equal('application/json');
      expect(res.body.gross_rent).to.equal(1000);
      expect(res.body.address).to.equal('1449 Lake Shore Ave, Los Angeles, CA 90026');
      expect(res.body.email).to.equal('joe@gmail.com');
      expect(res.body.agent).to.equal('david');
      expect(res.body.phone).to.equal(6128893535);
      done();
    });
});
});
